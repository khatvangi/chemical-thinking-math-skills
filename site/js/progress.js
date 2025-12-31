/**
 * Chemical Thinking - Progress Dashboard
 */

const API_URL = 'https://api.thebeakers.com';

const PRIMITIVES = [
    'COLLECTION', 'ARRANGEMENT', 'DIRECTION',
    'PROXIMITY', 'SAMENESS', 'CHANGE',
    'RATE', 'ACCUMULATION', 'SPREAD'
];

const TOPICS_PER_PRIMITIVE = {
    'COLLECTION': ['moles', 'electron_shells', 'isomer_counting'],
    'ARRANGEMENT': ['stereoisomers', 'crystal_packing', 'mo_diagrams'],
    'DIRECTION': ['bond_angles', 'dipoles', 'orbital_orientation'],
    'PROXIMITY': ['potential_energy', 'reaction_coordinates', 'intermolecular_forces'],
    'SAMENESS': ['molecular_symmetry', 'resonance', 'conservation_laws'],
    'CHANGE': ['reaction_progress', 'phase_transitions', 'electron_transfer'],
    'RATE': ['kinetics', 'half_life', 'diffusion'],
    'ACCUMULATION': ['work', 'heat', 'total_yield'],
    'SPREAD': ['boltzmann_distribution', 'entropy', 'orbital_probability']
};

document.addEventListener('DOMContentLoaded', function() {
    const loadBtn = document.getElementById('load-progress');
    const studentInput = document.getElementById('progress-student-id');

    if (loadBtn) {
        loadBtn.addEventListener('click', loadProgress);
    }

    if (studentInput) {
        studentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadProgress();
        });

        // Check for saved student ID
        const savedId = localStorage.getItem('chem_student_id');
        if (savedId) {
            studentInput.value = savedId;
            loadProgress();
        }
    }
});

async function loadProgress() {
    const studentId = document.getElementById('progress-student-id').value.trim();

    if (!studentId) {
        alert('Please enter your Student ID');
        return;
    }

    localStorage.setItem('chem_student_id', studentId);

    try {
        const response = await fetch(`${API_URL}/students/${studentId}/progress`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (!response.ok) {
            if (response.status === 404) {
                alert('Student not found. Please register first in Getting Started.');
                return;
            }
            throw new Error('Failed to load progress');
        }

        const data = await response.json();

        // Show dashboard
        document.getElementById('dashboard').style.display = 'block';

        // Update stats
        updateStats(data);

        // Update mastery grid
        updateMasteryGrid(data);

        // Update primitive progress
        updatePrimitiveProgress(data);

        // Update recommendations
        updateRecommendations(data);

    } catch (error) {
        alert('Error loading progress: ' + error.message);
    }
}

function updateStats(data) {
    const totalTopics = PRIMITIVES.length * 3; // 3 topics per primitive
    const masteredCount = data.total_mastered || 0;
    const completionPct = Math.round((masteredCount / totalTopics) * 100);

    document.getElementById('total-mastered').textContent = masteredCount;
    document.getElementById('total-attempts').textContent = data.total_attempts || 0;
    document.getElementById('completion-pct').textContent = completionPct + '%';

    // Calculate best streak
    let bestStreak = 0;
    if (data.progress) {
        data.progress.forEach(p => {
            if (p.streak > bestStreak) bestStreak = p.streak;
        });
    }
    document.getElementById('current-streak').textContent = bestStreak;
}

function updateMasteryGrid(data) {
    const container = document.getElementById('mastery-grid');

    // Create progress lookup
    const progressMap = {};
    if (data.progress) {
        data.progress.forEach(p => {
            const key = `${p.primitive}_${p.topic}`;
            progressMap[key] = p;
        });
    }

    let html = '<table class="mastery-table"><thead><tr><th>Primitive</th>';

    // Add topic columns
    for (let i = 1; i <= 3; i++) {
        html += `<th>Topic ${i}</th>`;
    }
    html += '</tr></thead><tbody>';

    // Add rows for each primitive
    PRIMITIVES.forEach(primitive => {
        html += `<tr><td class="primitive-name">${primitive}</td>`;

        const topics = TOPICS_PER_PRIMITIVE[primitive] || [];
        topics.forEach(topic => {
            const key = `${primitive}_${topic}`;
            const progress = progressMap[key];

            let status = '⬜';
            let statusClass = 'not-started';
            let tooltip = `${topic.replace(/_/g, ' ')}: Not started`;

            if (progress) {
                if (progress.mastery_achieved) {
                    status = '🟩';
                    statusClass = 'mastered';
                    tooltip = `${topic.replace(/_/g, ' ')}: Mastered!`;
                } else if (progress.streak > 0) {
                    status = '🟨';
                    statusClass = 'in-progress';
                    tooltip = `${topic.replace(/_/g, ' ')}: ${progress.streak}/3 streak`;
                } else if (progress.attempts > 0) {
                    status = '🟥';
                    statusClass = 'struggling';
                    tooltip = `${topic.replace(/_/g, ' ')}: Keep trying! (${progress.attempts} attempts)`;
                }
            }

            html += `<td class="mastery-cell ${statusClass}" title="${tooltip}">${status}</td>`;
        });

        html += '</tr>';
    });

    html += '</tbody></table>';

    // Add legend
    html += `
        <div class="mastery-legend">
            <span>⬜ Not started</span>
            <span>🟥 Struggling</span>
            <span>🟨 In progress</span>
            <span>🟩 Mastered</span>
        </div>
    `;

    container.innerHTML = html;
}

function updatePrimitiveProgress(data) {
    const container = document.getElementById('primitive-progress');

    // Group by primitive
    const byPrimitive = {};
    PRIMITIVES.forEach(p => {
        byPrimitive[p] = { mastered: 0, total: 3, attempts: 0 };
    });

    if (data.progress) {
        data.progress.forEach(p => {
            if (byPrimitive[p.primitive]) {
                byPrimitive[p.primitive].attempts += p.attempts;
                if (p.mastery_achieved) {
                    byPrimitive[p.primitive].mastered++;
                }
            }
        });
    }

    let html = '<div class="primitive-bars">';

    PRIMITIVES.forEach(primitive => {
        const info = byPrimitive[primitive];
        const pct = Math.round((info.mastered / info.total) * 100);

        html += `
            <div class="primitive-bar-item">
                <div class="primitive-bar-label">
                    <span>${primitive}</span>
                    <span>${info.mastered}/${info.total}</span>
                </div>
                <div class="primitive-bar-bg">
                    <div class="primitive-bar-fill" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function updateRecommendations(data) {
    const container = document.getElementById('recommendations');

    // Find topics to work on
    const recommendations = [];

    // Create progress lookup
    const progressMap = {};
    if (data.progress) {
        data.progress.forEach(p => {
            const key = `${p.primitive}_${p.topic}`;
            progressMap[key] = p;
        });
    }

    // Find struggling and not-started topics
    PRIMITIVES.forEach(primitive => {
        const topics = TOPICS_PER_PRIMITIVE[primitive] || [];
        topics.forEach(topic => {
            const key = `${primitive}_${topic}`;
            const progress = progressMap[key];

            if (!progress) {
                recommendations.push({
                    type: 'start',
                    primitive,
                    topic,
                    message: `Start learning ${topic.replace(/_/g, ' ')}`
                });
            } else if (!progress.mastery_achieved && progress.attempts > 3) {
                recommendations.push({
                    type: 'review',
                    primitive,
                    topic,
                    message: `Review ${topic.replace(/_/g, ' ')} - you're close!`
                });
            }
        });
    });

    if (recommendations.length === 0) {
        if (data.total_mastered === 27) {
            container.innerHTML = `
                <div class="recommendation-card success">
                    <h4>🎉 Congratulations!</h4>
                    <p>You've mastered all topics! Consider helping classmates or exploring advanced problems.</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="recommendation-card">
                    <p>Keep practicing! You're making good progress.</p>
                </div>
            `;
        }
        return;
    }

    // Show top 3 recommendations
    let html = '<div class="recommendations-list">';
    recommendations.slice(0, 3).forEach(rec => {
        const icon = rec.type === 'start' ? '📚' : '🔄';
        html += `
            <div class="recommendation-card ${rec.type}">
                <span class="rec-icon">${icon}</span>
                <div class="rec-content">
                    <strong>${rec.primitive}</strong>
                    <p>${rec.message}</p>
                    <a href="practice/index.qmd" class="btn btn-sm">Practice Now</a>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }

    .stat-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        text-align: center;
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
    }

    .stat-label {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .mastery-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
    }

    .mastery-table th, .mastery-table td {
        padding: 0.75rem;
        text-align: center;
        border: 1px solid #e0e0e0;
    }

    .mastery-table th {
        background: #f8f9fa;
    }

    .primitive-name {
        font-weight: 600;
        text-align: left !important;
        background: #f8f9fa;
    }

    .mastery-cell {
        font-size: 1.5rem;
        cursor: help;
    }

    .mastery-legend {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        margin-top: 1rem;
        font-size: 0.9rem;
    }

    .primitive-bars {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .primitive-bar-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .primitive-bar-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
    }

    .primitive-bar-bg {
        height: 12px;
        background: #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
    }

    .primitive-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: 6px;
        transition: width 0.5s ease;
    }

    .recommendations-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .recommendation-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #6366f1;
    }

    .recommendation-card.start {
        border-left-color: #10b981;
    }

    .recommendation-card.review {
        border-left-color: #f59e0b;
    }

    .recommendation-card.success {
        border-left-color: #10b981;
        background: #d1fae5;
    }

    .rec-icon {
        font-size: 2rem;
    }

    .rec-content p {
        margin: 0.25rem 0;
    }

    .btn-sm {
        padding: 0.25rem 0.75rem;
        font-size: 0.85rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-control {
        width: 100%;
        max-width: 300px;
        padding: 0.5rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }

    .btn-primary {
        background: #6366f1;
        color: white;
    }

    .btn-primary:hover {
        background: #4f46e5;
    }
`;
document.head.appendChild(style);
