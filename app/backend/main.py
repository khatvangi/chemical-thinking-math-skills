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
from typing import Optional, List, Dict, Any

# Import database module
import database as db

app = FastAPI(title="Chemical Thinking API", version="1.0.0")

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


# ============== Student Endpoints ==============

class StudentRegistration(BaseModel):
    student_id: str
    name: str
    email: str


class HomeworkSubmission(BaseModel):
    student_id: str
    assignment_id: int
    answers: Dict[str, Any]


@app.post("/students/register")
async def register_student(student: StudentRegistration):
    """Register a new student"""
    result = db.create_student(student.student_id, student.name, student.email)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.get("/students/{student_id}")
async def get_student(student_id: str):
    """Get student profile"""
    student = db.get_student(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.update_last_active(student_id)
    return student


@app.get("/students/{student_id}/progress")
async def get_student_progress(student_id: str):
    """Get student's mastery progress"""
    student = db.get_student(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    progress = db.get_progress(student_id)

    # Organize by primitive
    by_primitive = {}
    for p in progress:
        if p["primitive"] not in by_primitive:
            by_primitive[p["primitive"]] = []
        by_primitive[p["primitive"]].append(p)

    return {
        "student_id": student_id,
        "progress": progress,
        "by_primitive": by_primitive,
        "total_mastered": sum(1 for p in progress if p["mastery_achieved"]),
        "total_attempts": sum(p["attempts"] for p in progress)
    }


# ============== Homework Endpoints ==============

@app.get("/homework")
async def list_homework():
    """Get all active homework assignments"""
    return db.get_active_assignments()


@app.post("/homework/submit")
async def submit_homework(submission: HomeworkSubmission):
    """Submit homework answers"""
    student = db.get_student(submission.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    result = db.submit_homework(
        submission.student_id,
        submission.assignment_id,
        submission.answers
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.get("/homework/{student_id}/submissions")
async def get_submissions(student_id: str):
    """Get student's homework submissions"""
    return db.get_student_submissions(student_id)


# ============== Leaderboard ==============

@app.get("/leaderboard")
async def get_leaderboard(primitive: str = None, limit: int = 10):
    """Get top students by mastery"""
    return db.get_leaderboard(primitive, limit)


# ============== Enhanced Grade with DB ==============

class GradeWithStudent(AnswerSubmission):
    student_id: Optional[str] = None


@app.post("/grade-tracked")
async def grade_with_tracking(submission: GradeWithStudent):
    """Grade answer and track in database"""
    # Get base grading
    base_submission = AnswerSubmission(
        problem_id=submission.problem_id,
        problem_text=submission.problem_text,
        correct_answer=submission.correct_answer,
        student_answer=submission.student_answer,
        primitive=submission.primitive,
        topic=submission.topic,
        hints_given=submission.hints_given
    )

    result = await grade_answer(base_submission)

    # Track in database if student_id provided
    if submission.student_id:
        # Record attempt
        db.record_attempt(
            submission.student_id,
            submission.primitive,
            submission.topic,
            submission.problem_text,
            submission.student_answer,
            submission.correct_answer,
            result.correct,
            result.feedback
        )

        # Update progress
        progress = db.update_progress(
            submission.student_id,
            submission.primitive,
            submission.topic,
            result.correct
        )

        return {
            **result.dict(),
            "streak": progress["streak"],
            "mastery_achieved": progress["mastery_achieved"],
            "total_attempts": progress["attempts"]
        }

    return result


# ============== Problem-set submissions (access-code login) ==============
# codes + instructor key live in secrets.json next to this file (never committed)

from pathlib import Path

SECRETS_PATH = Path(__file__).parent / "secrets.json"
try:
    _secrets = json.loads(SECRETS_PATH.read_text())
except FileNotFoundError:
    _secrets = {"access_codes": [], "instructor_key": ""}
# secrets.json layout: top-level access_codes/instructor_key are chem291 (the
# original course); further courses live under "courses": {"chem380": {...}}.
# each course has its own instructor key, so instructor views are separate.
COURSES = {"chem291": {"access_codes": _secrets.get("access_codes", []),
                       "instructor_key": _secrets.get("instructor_key", ""),
                       "num_sets": 5}}
for _name, _c in _secrets.get("courses", {}).items():
    COURSES[_name] = {"access_codes": _c.get("access_codes", []),
                      "instructor_key": _c.get("instructor_key", ""),
                      "num_sets": int(_c.get("num_sets", 0))}
db.seed_access_codes(COURSES["chem291"]["access_codes"])
for _name, _c in COURSES.items():
    if _name != "chem291":
        db.seed_access_codes(_c["access_codes"], course=_name, prefix=f"{_name}-student")

MAX_ANSWER_CHARS = 100_000


class PsLogin(BaseModel):
    code: str
    name: Optional[str] = None
    course: str = "chem291"


class PsSubmit(BaseModel):
    code: str
    set_id: int
    answers: str
    course: str = "chem291"


def _student_for_code(code: str, course: str = "chem291"):
    """resolve an access code; a code from another course is rejected"""
    if course not in COURSES:
        raise HTTPException(status_code=400, detail="Unknown course")
    student = db.get_student_by_code(code.strip().upper())
    if not student or student.get("course", "chem291") != course:
        raise HTTPException(status_code=401, detail="Unknown access code")
    return student


@app.post("/ps/login")
async def ps_login(body: PsLogin):
    """validate an access code; first login also records the student's name"""
    student = _student_for_code(body.code, body.course)
    if body.name and body.name.strip():
        db.set_student_name(student["student_id"], body.name.strip()[:80])
        student["name"] = body.name.strip()[:80]
    db.update_last_active(student["student_id"])
    return {
        "ok": True,
        "name": student["name"],
        "needs_name": not student["name"],
    }


@app.post("/ps/submit")
async def ps_submit(body: PsSubmit):
    """submit (or resubmit) answers for one problem set"""
    student = _student_for_code(body.code, body.course)
    num_sets = COURSES[body.course]["num_sets"]
    if not 1 <= body.set_id <= num_sets:
        raise HTTPException(status_code=400, detail=f"set_id must be 1-{num_sets}")
    text = body.answers.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Answers are empty")
    if len(text) > MAX_ANSWER_CHARS:
        raise HTTPException(status_code=400, detail="Submission too long")
    result = db.upsert_ps_submission(student["student_id"], body.set_id, text)
    return result


@app.get("/ps/submissions")
async def ps_my_submissions(code: str, course: str = "chem291"):
    """a student's own submissions, for prefilling the form"""
    student = _student_for_code(code, course)
    return db.get_ps_submissions(student["student_id"])


@app.get("/ps/instructor")
async def ps_instructor(key: str, course: str = "chem291"):
    """all submissions for one course; requires that course's instructor key"""
    expected = COURSES.get(course, {}).get("instructor_key", "")
    if not expected or key != expected:
        raise HTTPException(status_code=401, detail="Bad instructor key")
    return db.get_all_ps_submissions(course)


if __name__ == "__main__":
    import os
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
