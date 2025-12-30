"""
Chemical Thinking - Adaptive Learning Backend
Connects to Ollama for LLM-powered grading and problem generation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import re
from typing import Optional

app = FastAPI(title="Chemical Thinking API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
OLLAMA_URL = "http://localhost:11434"
DEFAULT_MODEL = "qwen3:latest"  # 8B model - good balance of speed/quality
MATH_MODEL = "qwen3:latest"  # Use 8B for faster responses (32B available for complex tasks)


class AnswerSubmission(BaseModel):
    problem_id: str
    problem_text: str
    correct_answer: str
    student_answer: str
    primitive: str  # DIRECTION, COLLECTION, etc.
    topic: str
    hints_given: int = 0


class ProblemRequest(BaseModel):
    primitive: str
    topic: str
    difficulty: int = 1  # 1-3
    previous_problem: Optional[str] = None


class GradingResponse(BaseModel):
    correct: bool
    feedback: str
    worked_example: Optional[str] = None
    next_problem: Optional[dict] = None
    mastery_progress: int  # 0-100


async def query_ollama(prompt: str, model: str = None, system: str = None) -> str:
    """Query Ollama API"""
    model = model or DEFAULT_MODEL

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    async with httpx.AsyncClient(timeout=120.0) as client:  # Increased timeout
        try:
            response = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": model,
                    "messages": messages,
                    "stream": False
                }
            )
            response.raise_for_status()
            return response.json()["message"]["content"]
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Ollama unavailable: {e}")


GRADING_SYSTEM = """You are a chemistry-math tutor using the "Chemical Thinking" approach.
Your role is to:
1. Check if the student's answer is correct (be flexible with formatting/units)
2. If wrong, explain WHY without giving away the answer
3. Provide a worked example of a SIMILAR problem
4. Be encouraging but direct - no coddling

Respond in JSON format:
{
    "correct": true/false,
    "feedback": "explanation of what they got right/wrong",
    "worked_example": "if wrong, show a similar worked problem",
    "hint": "if wrong, a hint for the original problem"
}
"""


PROBLEM_GEN_SYSTEM = """You are generating practice problems for a chemistry-math course.
The course uses 9 primitives: COLLECTION, ARRANGEMENT, DIRECTION, PROXIMITY, SAMENESS, CHANGE, RATE, ACCUMULATION, SPREAD.

Generate a problem that:
1. Starts with a real chemical phenomenon (the hook)
2. Tests understanding of the specified primitive
3. Has a clear numerical or short answer
4. Matches the difficulty level (1=basic, 2=intermediate, 3=advanced)

Respond in JSON format:
{
    "problem_text": "the problem statement",
    "correct_answer": "the answer (number or short phrase)",
    "hint1": "first hint if they struggle",
    "hint2": "second hint (more direct)",
    "worked_solution": "full solution explanation",
    "chemistry_connection": "why this matters in chemistry"
}
"""


@app.get("/health")
async def health_check():
    """Check if backend and Ollama are running"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_URL}/api/tags")
            models = [m["name"] for m in response.json().get("models", [])]
            return {"status": "healthy", "ollama": "connected", "models": models}
    except:
        return {"status": "degraded", "ollama": "disconnected", "models": []}


@app.post("/grade", response_model=GradingResponse)
async def grade_answer(submission: AnswerSubmission):
    """Grade student answer and provide adaptive feedback"""

    prompt = f"""
Problem: {submission.problem_text}
Correct Answer: {submission.correct_answer}
Student Answer: {submission.student_answer}
Primitive: {submission.primitive}
Topic: {submission.topic}
Hints already given: {submission.hints_given}

Grade this answer and provide feedback.
"""

    response_text = await query_ollama(prompt, MATH_MODEL, GRADING_SYSTEM)

    # Parse JSON response
    try:
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = {"correct": False, "feedback": response_text}
    except json.JSONDecodeError:
        result = {"correct": False, "feedback": response_text}

    is_correct = result.get("correct", False)

    # Generate next problem if wrong
    next_problem = None
    if not is_correct:
        next_problem = await generate_similar_problem(submission)

    # Calculate mastery progress (simplified)
    mastery = 100 if is_correct else max(0, 30 - submission.hints_given * 10)

    return GradingResponse(
        correct=is_correct,
        feedback=result.get("feedback", ""),
        worked_example=result.get("worked_example"),
        next_problem=next_problem,
        mastery_progress=mastery
    )


async def generate_similar_problem(submission: AnswerSubmission) -> dict:
    """Generate a similar problem for practice"""
    prompt = f"""
Generate a problem similar to this one but with different numbers/molecules:

Original problem: {submission.problem_text}
Primitive: {submission.primitive}
Topic: {submission.topic}
Difficulty: 1 (keep it accessible since student struggled)

Make it test the same concept but look different.
"""

    response_text = await query_ollama(prompt, MATH_MODEL, PROBLEM_GEN_SYSTEM)

    try:
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except json.JSONDecodeError:
        pass

    return {"problem_text": "Try this: What is the bond angle in methane (CH4)?",
            "correct_answer": "109.5 degrees"}


@app.post("/generate-problem")
async def generate_problem(request: ProblemRequest):
    """Generate a new problem for a given primitive/topic"""

    prompt = f"""
Generate a chemistry-math problem:
Primitive: {request.primitive}
Topic: {request.topic}
Difficulty: {request.difficulty}
"""

    if request.previous_problem:
        prompt += f"\nMake it different from: {request.previous_problem}"

    response_text = await query_ollama(prompt, MATH_MODEL, PROBLEM_GEN_SYSTEM)

    try:
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except json.JSONDecodeError:
        pass

    raise HTTPException(status_code=500, detail="Failed to generate problem")


@app.get("/primitives")
async def list_primitives():
    """List all primitives with their topics"""
    return {
        "COLLECTION": ["moles", "electron_shells", "isomer_counting"],
        "ARRANGEMENT": ["stereoisomers", "crystal_packing", "mo_diagrams"],
        "DIRECTION": ["bond_angles", "dipoles", "orbital_orientation"],
        "PROXIMITY": ["potential_energy", "reaction_coordinates", "intermolecular_forces"],
        "SAMENESS": ["molecular_symmetry", "resonance", "conservation_laws"],
        "CHANGE": ["reaction_progress", "phase_transitions", "electron_transfer"],
        "RATE": ["kinetics", "half_life", "diffusion"],
        "ACCUMULATION": ["work", "heat", "total_yield"],
        "SPREAD": ["boltzmann_distribution", "entropy", "orbital_probability"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
