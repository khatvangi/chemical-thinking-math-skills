/**
 * Chemical Thinking - Adaptive Practice Widget
 * IXL-style mastery-based learning component
 */

class ChemPractice {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.apiUrl = options.apiUrl || 'http://localhost:8000';
        this.primitive = options.primitive || 'DIRECTION';
        this.topic = options.topic || 'bond_angles';

        // State
        this.currentProblem = null;
        this.hintsGiven = 0;
        this.streak = 0;
        this.masteryTarget = 3; // Correct answers needed for mastery
        this.history = [];

        this.init();
    }

    async init() {
        this.render();
        await this.loadProblem();
    }

    render() {
        this.container.innerHTML = `
            <div class="chem-practice">
                <div class="practice-header">
                    <span class="primitive-badge">${this.primitive}</span>
                    <span class="topic-label">${this.topic.replace(/_/g, ' ')}</span>
                    <div class="mastery-bar">
                        <div class="mastery-fill" style="width: 0%"></div>
                        <span class="mastery-text">0 / ${this.masteryTarget}</span>
                    </div>
                </div>

                <div class="problem-area">
                    <div class="problem-text">Loading...</div>
                </div>

                <div class="answer-area">
                    <input type="text" class="answer-input" placeholder="Your answer...">
                    <button class="submit-btn">Check Answer</button>
                    <button class="hint-btn">Get Hint</button>
                </div>

                <div class="feedback-area" style="display: none;">
                    <div class="feedback-icon"></div>
                    <div class="feedback-text"></div>
                    <div class="worked-example" style="display: none;"></div>
                    <button class="next-btn" style="display: none;">Next Problem</button>
                </div>

                <div class="mastery-complete" style="display: none;">
                    <div class="celebration">Mastery Achieved!</div>
                    <p>You've demonstrated understanding of ${this.topic.replace(/_/g, ' ')}.</p>
                    <button class="continue-btn">Continue to Next Topic</button>
                </div>
            </div>
        `;

        this.addStyles();
        this.bindEvents();
    }

    addStyles() {
        if (document.getElementById('chem-practice-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'chem-practice-styles';
        styles.textContent = `
            .chem-practice {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 700px;
                margin: 2rem auto;
                padding: 1.5rem;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                background: #fafafa;
            }

            .practice-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }

            .primitive-badge {
                background: #6366f1;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
            }

            .topic-label {
                color: #666;
                text-transform: capitalize;
            }

            .mastery-bar {
                margin-left: auto;
                width: 150px;
                height: 24px;
                background: #e0e0e0;
                border-radius: 12px;
                position: relative;
                overflow: hidden;
            }

            .mastery-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #34d399);
                transition: width 0.5s ease;
            }

            .mastery-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 0.75rem;
                font-weight: 600;
                color: #333;
            }

            .problem-area {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border: 1px solid #e0e0e0;
            }

            .problem-text {
                font-size: 1.1rem;
                line-height: 1.6;
                color: #333;
            }

            .answer-area {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .answer-input {
                flex: 1;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                transition: border-color 0.2s;
            }

            .answer-input:focus {
                outline: none;
                border-color: #6366f1;
            }

            .submit-btn, .hint-btn, .next-btn, .continue-btn {
                padding: 0.75rem 1.5rem;
                font-size: 1rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: transform 0.1s, box-shadow 0.2s;
            }

            .submit-btn {
                background: #6366f1;
                color: white;
            }

            .submit-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }

            .hint-btn {
                background: #f3f4f6;
                color: #666;
            }

            .hint-btn:hover {
                background: #e5e7eb;
            }

            .feedback-area {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            .feedback-area.correct {
                background: #d1fae5;
                border: 1px solid #10b981;
            }

            .feedback-area.incorrect {
                background: #fee2e2;
                border: 1px solid #ef4444;
            }

            .feedback-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            .feedback-text {
                font-size: 1rem;
                line-height: 1.5;
                color: #333;
            }

            .worked-example {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(255,255,255,0.7);
                border-radius: 6px;
                font-size: 0.95rem;
            }

            .worked-example h4 {
                margin: 0 0 0.5rem 0;
                color: #666;
            }

            .next-btn {
                margin-top: 1rem;
                background: #10b981;
                color: white;
            }

            .mastery-complete {
                text-align: center;
                padding: 2rem;
            }

            .celebration {
                font-size: 1.5rem;
                font-weight: 700;
                color: #10b981;
                margin-bottom: 0.5rem;
            }

            .continue-btn {
                background: #6366f1;
                color: white;
                margin-top: 1rem;
            }

            .hint-text {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                padding: 0.75rem 1rem;
                border-radius: 6px;
                margin-top: 0.5rem;
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        const submitBtn = this.container.querySelector('.submit-btn');
        const hintBtn = this.container.querySelector('.hint-btn');
        const answerInput = this.container.querySelector('.answer-input');
        const nextBtn = this.container.querySelector('.next-btn');
        const continueBtn = this.container.querySelector('.continue-btn');

        submitBtn.addEventListener('click', () => this.submitAnswer());
        hintBtn.addEventListener('click', () => this.showHint());
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnswer();
        });
        nextBtn.addEventListener('click', () => this.loadProblem());
        continueBtn.addEventListener('click', () => this.onMasteryComplete());
    }

    async loadProblem() {
        const problemArea = this.container.querySelector('.problem-text');
        const feedbackArea = this.container.querySelector('.feedback-area');
        const answerInput = this.container.querySelector('.answer-input');
        const masteryComplete = this.container.querySelector('.mastery-complete');

        problemArea.textContent = 'Loading...';
        feedbackArea.style.display = 'none';
        masteryComplete.style.display = 'none';
        answerInput.value = '';
        answerInput.disabled = false;
        this.hintsGiven = 0;

        try {
            const response = await fetch(`${this.apiUrl}/generate-problem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    primitive: this.primitive,
                    topic: this.topic,
                    difficulty: Math.min(3, 1 + Math.floor(this.streak / 2)),
                    previous_problem: this.currentProblem?.problem_text
                })
            });

            if (!response.ok) throw new Error('Failed to load problem');

            this.currentProblem = await response.json();
            problemArea.textContent = this.currentProblem.problem_text;
        } catch (error) {
            // Fallback to seed problems if API unavailable
            this.currentProblem = this.getSeedProblem();
            problemArea.textContent = this.currentProblem.problem_text;
        }
    }

    async submitAnswer() {
        const answerInput = this.container.querySelector('.answer-input');
        const feedbackArea = this.container.querySelector('.feedback-area');
        const feedbackIcon = this.container.querySelector('.feedback-icon');
        const feedbackText = this.container.querySelector('.feedback-text');
        const workedExample = this.container.querySelector('.worked-example');
        const nextBtn = this.container.querySelector('.next-btn');

        const studentAnswer = answerInput.value.trim();
        if (!studentAnswer) return;

        answerInput.disabled = true;

        try {
            const response = await fetch(`${this.apiUrl}/grade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem_id: `${this.primitive}_${Date.now()}`,
                    problem_text: this.currentProblem.problem_text,
                    correct_answer: this.currentProblem.correct_answer,
                    student_answer: studentAnswer,
                    primitive: this.primitive,
                    topic: this.topic,
                    hints_given: this.hintsGiven
                })
            });

            const result = response.ok ? await response.json() : this.localGrade(studentAnswer);
            this.showFeedback(result);
        } catch (error) {
            // Fallback to local grading
            const result = this.localGrade(studentAnswer);
            this.showFeedback(result);
        }
    }

    localGrade(studentAnswer) {
        // Simple local grading for when API is unavailable
        const correct = this.currentProblem.correct_answer;
        const normalizedStudent = studentAnswer.toLowerCase().replace(/[^a-z0-9.]/g, '');
        const normalizedCorrect = correct.toLowerCase().replace(/[^a-z0-9.]/g, '');

        const isCorrect = normalizedStudent === normalizedCorrect ||
                          normalizedStudent.includes(normalizedCorrect) ||
                          normalizedCorrect.includes(normalizedStudent);

        return {
            correct: isCorrect,
            feedback: isCorrect
                ? "Correct! Great work."
                : `Not quite. The answer is ${correct}. ${this.currentProblem.worked_solution || ''}`,
            worked_example: isCorrect ? null : this.currentProblem.worked_solution,
            mastery_progress: isCorrect ? 100 : 0
        };
    }

    showFeedback(result) {
        const feedbackArea = this.container.querySelector('.feedback-area');
        const feedbackIcon = this.container.querySelector('.feedback-icon');
        const feedbackText = this.container.querySelector('.feedback-text');
        const workedExample = this.container.querySelector('.worked-example');
        const nextBtn = this.container.querySelector('.next-btn');

        feedbackArea.style.display = 'block';
        feedbackArea.className = `feedback-area ${result.correct ? 'correct' : 'incorrect'}`;
        feedbackIcon.textContent = result.correct ? '✓' : '✗';
        feedbackText.textContent = result.feedback;

        if (result.worked_example && !result.correct) {
            workedExample.style.display = 'block';
            workedExample.innerHTML = `<h4>Worked Example:</h4>${result.worked_example}`;
        } else {
            workedExample.style.display = 'none';
        }

        if (result.correct) {
            this.streak++;
            this.updateMastery();

            if (this.streak >= this.masteryTarget) {
                this.container.querySelector('.mastery-complete').style.display = 'block';
                feedbackArea.style.display = 'none';
            } else {
                nextBtn.style.display = 'inline-block';
            }
        } else {
            this.streak = 0;
            this.updateMastery();
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = 'Try Similar Problem';
        }

        this.history.push({
            problem: this.currentProblem,
            answer: this.container.querySelector('.answer-input').value,
            correct: result.correct,
            timestamp: new Date()
        });
    }

    showHint() {
        const problemArea = this.container.querySelector('.problem-area');
        const existingHint = problemArea.querySelector('.hint-text');

        if (existingHint) existingHint.remove();

        this.hintsGiven++;

        const hints = [
            this.currentProblem.hint1,
            this.currentProblem.hint2,
            `The answer is close to: ${this.currentProblem.correct_answer}`
        ];

        const hint = hints[Math.min(this.hintsGiven - 1, hints.length - 1)] ||
                     "Think about the underlying pattern here.";

        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint-text';
        hintDiv.textContent = `Hint ${this.hintsGiven}: ${hint}`;
        problemArea.appendChild(hintDiv);
    }

    updateMastery() {
        const fill = this.container.querySelector('.mastery-fill');
        const text = this.container.querySelector('.mastery-text');

        const progress = (this.streak / this.masteryTarget) * 100;
        fill.style.width = `${progress}%`;
        text.textContent = `${this.streak} / ${this.masteryTarget}`;
    }

    onMasteryComplete() {
        // Emit event for parent page to handle
        const event = new CustomEvent('mastery-complete', {
            detail: {
                primitive: this.primitive,
                topic: this.topic,
                attempts: this.history.length,
                streak: this.streak
            }
        });
        this.container.dispatchEvent(event);
    }

    getSeedProblem() {
        // Seed problems for DIRECTION primitive (fallback)
        const problems = [
            {
                problem_text: "Water (H₂O) has a bent molecular geometry. The H-O-H bond angle is approximately what value in degrees?",
                correct_answer: "104.5",
                hint1: "It's less than the tetrahedral angle (109.5°) because of lone pair repulsion.",
                hint2: "The answer is between 100° and 110°.",
                worked_solution: "Water has 2 bonding pairs and 2 lone pairs around oxygen. Lone pairs repel more strongly than bonding pairs, compressing the H-O-H angle from 109.5° to about 104.5°."
            },
            {
                problem_text: "Methane (CH₄) has a tetrahedral geometry. What is the H-C-H bond angle?",
                correct_answer: "109.5",
                hint1: "In a perfect tetrahedron, all angles are equal.",
                hint2: "Think about the angle that maximizes distance between 4 equivalent positions.",
                worked_solution: "With 4 bonding pairs and no lone pairs, the electron geometry is tetrahedral. The bond angle is arccos(-1/3) ≈ 109.5°."
            },
            {
                problem_text: "Carbon dioxide (CO₂) is a linear molecule. What is the O-C-O bond angle?",
                correct_answer: "180",
                hint1: "Linear means the atoms are in a straight line.",
                hint2: "What's the angle of a straight line?",
                worked_solution: "CO₂ has 2 bonding domains (double bonds) and no lone pairs on carbon. Maximum separation = straight line = 180°."
            }
        ];

        return problems[Math.floor(Math.random() * problems.length)];
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChemPractice;
}
