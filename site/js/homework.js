/**
 * Chemical Thinking - Homework System
 */

const API_URL = 'https://unawaked-unlunar-alyvia.ngrok-free.dev';

// Load assignments on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadAssignments();

    // Setup event listeners
    const studentIdInput = document.getElementById('hw-student-id');
    if (studentIdInput) {
        studentIdInput.addEventListener('change', loadSubmissions);

        // Check for saved student ID
        const savedId = localStorage.getItem('chem_student_id');
        if (savedId) {
            studentIdInput.value = savedId;
            loadSubmissions();
        }
    }

    const submitBtn = document.getElementById('submit-homework');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitHomework);
    }

    const assignmentSelect = document.getElementById('hw-assignment');
    if (assignmentSelect) {
        assignmentSelect.addEventListener('change', loadAssignmentProblems);
    }

    // Show form
    const form = document.getElementById('homework-form');
    if (form) form.style.display = 'block';
});

async function loadAssignments() {
    const container = document.getElementById('assignments-list');

    try {
        const response = await fetch(`${API_URL}/homework`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const assignments = await response.json();

        if (assignments.length === 0) {
            container.innerHTML = `
                <div class="callout callout-note">
                    <p>No active assignments at this time. Check back later!</p>
                </div>
            `;
            return;
        }

        // Populate select dropdown
        const select = document.getElementById('hw-assignment');
        if (select) {
            select.innerHTML = '<option value="">-- Select Assignment --</option>';
            assignments.forEach(a => {
                const option = document.createElement('option');
                option.value = a.id;
                option.textContent = `${a.title} (Due: ${formatDate(a.due_date)})`;
                select.appendChild(option);
            });
        }

        // Display assignments list
        let html = '<div class="assignments-grid">';
        assignments.forEach(a => {
            const dueDate = new Date(a.due_date);
            const isOverdue = dueDate < new Date();

            html += `
                <div class="assignment-card ${isOverdue ? 'overdue' : ''}">
                    <h4>${a.title}</h4>
                    <p>${a.description || 'No description'}</p>
                    <p><strong>Primitives:</strong> ${a.primitives.join(', ')}</p>
                    <p><strong>Due:</strong> ${formatDate(a.due_date)}</p>
                    ${isOverdue ? '<span class="badge badge-danger">Past Due</span>' : '<span class="badge badge-success">Open</span>'}
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `
            <div class="callout callout-warning">
                <p>Could not load assignments. Server may be offline.</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

async function loadAssignmentProblems() {
    const assignmentId = document.getElementById('hw-assignment').value;
    const container = document.getElementById('problems-container');

    if (!assignmentId) {
        container.innerHTML = '';
        return;
    }

    // For now, generate sample problems based on assignment
    // In production, these would come from the database
    const sampleProblems = [
        {
            id: 'p1',
            text: 'What is the H-O-H bond angle in water (in degrees)?',
            type: 'numerical'
        },
        {
            id: 'p2',
            text: 'Why does CO₂ have no net dipole moment despite having polar bonds?',
            type: 'short_answer'
        },
        {
            id: 'p3',
            text: 'Calculate the magnitude of the net dipole moment when two 1.5 D dipoles are at 120° to each other.',
            type: 'numerical'
        }
    ];

    let html = '<h4>Problems</h4>';
    sampleProblems.forEach((p, i) => {
        html += `
            <div class="problem-item">
                <label><strong>Problem ${i + 1}:</strong> ${p.text}</label>
                <input type="text"
                       id="answer-${p.id}"
                       class="form-control problem-answer"
                       data-problem-id="${p.id}"
                       placeholder="Your answer...">
            </div>
        `;
    });

    container.innerHTML = html;
}

async function submitHomework() {
    const studentId = document.getElementById('hw-student-id').value.trim();
    const assignmentId = document.getElementById('hw-assignment').value;
    const statusDiv = document.getElementById('submission-status');

    if (!studentId) {
        statusDiv.innerHTML = '<div class="alert alert-danger">Please enter your Student ID</div>';
        return;
    }

    if (!assignmentId) {
        statusDiv.innerHTML = '<div class="alert alert-danger">Please select an assignment</div>';
        return;
    }

    // Collect answers
    const answers = {};
    document.querySelectorAll('.problem-answer').forEach(input => {
        answers[input.dataset.problemId] = input.value.trim();
    });

    // Check for empty answers
    const emptyCount = Object.values(answers).filter(a => !a).length;
    if (emptyCount > 0) {
        statusDiv.innerHTML = `<div class="alert alert-warning">${emptyCount} answer(s) are empty. Continue anyway?</div>`;
    }

    // Save student ID
    localStorage.setItem('chem_student_id', studentId);

    try {
        statusDiv.innerHTML = '<div class="alert alert-info">Submitting...</div>';

        const response = await fetch(`${API_URL}/homework/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                student_id: studentId,
                assignment_id: parseInt(assignmentId),
                answers: answers
            })
        });

        const result = await response.json();

        if (response.ok) {
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>Submitted!</strong> ${result.message}
                </div>
            `;
            loadSubmissions();
        } else {
            statusDiv.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${result.detail || 'Submission failed'}
                </div>
            `;
        }

    } catch (error) {
        statusDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>Error:</strong> Could not connect to server. ${error.message}
            </div>
        `;
    }
}

async function loadSubmissions() {
    const studentId = document.getElementById('hw-student-id').value.trim();
    const container = document.getElementById('my-submissions');

    if (!studentId) {
        container.innerHTML = '<p>Enter your Student ID to view submissions.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/homework/${studentId}/submissions`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (!response.ok) {
            throw new Error('Could not load submissions');
        }

        const submissions = await response.json();

        if (submissions.length === 0) {
            container.innerHTML = '<p>No submissions yet.</p>';
            return;
        }

        let html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Assignment</th>
                        <th>Submitted</th>
                        <th>Score</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        submissions.forEach(s => {
            const score = s.score !== null ? `${s.score}%` : 'Pending';
            const status = s.graded_at ? 'Graded' : 'Submitted';

            html += `
                <tr>
                    <td>${s.title}</td>
                    <td>${formatDate(s.submitted_at)}</td>
                    <td>${score}</td>
                    <td><span class="badge ${s.graded_at ? 'badge-success' : 'badge-info'}">${status}</span></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `<p class="text-danger">Error loading submissions: ${error.message}</p>`;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .assignments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }

    .assignment-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
        background: #f8f9fa;
    }

    .assignment-card.overdue {
        border-color: #dc3545;
        background: #fff5f5;
    }

    .assignment-card h4 {
        margin-top: 0;
        color: #333;
    }

    .problem-item {
        margin: 1rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
    }

    .problem-item label {
        display: block;
        margin-bottom: 0.5rem;
    }

    .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    .badge-success { background: #d4edda; color: #155724; }
    .badge-danger { background: #f8d7da; color: #721c24; }
    .badge-info { background: #d1ecf1; color: #0c5460; }
    .badge-warning { background: #fff3cd; color: #856404; }

    .alert {
        padding: 1rem;
        border-radius: 6px;
        margin: 1rem 0;
    }

    .alert-success { background: #d4edda; color: #155724; }
    .alert-danger { background: #f8d7da; color: #721c24; }
    .alert-info { background: #d1ecf1; color: #0c5460; }
    .alert-warning { background: #fff3cd; color: #856404; }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
    }

    .table th, .table td {
        padding: 0.75rem;
        border-bottom: 1px solid #e0e0e0;
        text-align: left;
    }

    .table th {
        background: #f8f9fa;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
