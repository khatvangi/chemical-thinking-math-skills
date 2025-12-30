/**
 * DIRECTION: Interactive Visualizations
 * Cognitive primitive explorations - things that point
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all visuals
    initTowardAwayVisual();
    initBodyDirectionsVisual();
    initCircleDirectionsVisual();
    initSphereDirectionsVisual();
    initCombiningDirectionsVisual();
    initGradientVisual();
    initCausationVisual();
});

// ============================================
// VISUAL 1: Toward / Away Binary
// ============================================
function initTowardAwayVisual() {
    const container = document.getElementById('toward-away-visual');
    if (!container) return;

    const width = 500;
    const height = 250;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>Drag the food and danger to see the organism respond</strong>
        </div>
        <svg id="toward-away-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; background: #f8fafc; border-radius: 8px;"></svg>
        <div style="text-align: center; margin-top: 10px; font-size: 14px; color: #666;">
            The ur-direction: <span style="color: #22c55e; font-weight: bold;">toward</span> what helps,
            <span style="color: #ef4444; font-weight: bold;">away from</span> what harms
        </div>
    `;

    const svg = document.getElementById('toward-away-svg');

    // State
    let foodPos = { x: 100, y: 125 };
    let dangerPos = { x: 400, y: 125 };
    const organismPos = { x: 250, y: 125 };

    function render() {
        // Calculate direction to food and away from danger
        const toFoodX = foodPos.x - organismPos.x;
        const toFoodY = foodPos.y - organismPos.y;
        const foodDist = Math.sqrt(toFoodX * toFoodX + toFoodY * toFoodY);

        const toDangerX = dangerPos.x - organismPos.x;
        const toDangerY = dangerPos.y - organismPos.y;
        const dangerDist = Math.sqrt(toDangerX * toDangerX + toDangerY * toDangerY);

        // Normalize and combine (attracted to food, repelled by danger)
        const attraction = 50 / Math.max(foodDist, 50);
        const repulsion = 50 / Math.max(dangerDist, 50);

        let dirX = (toFoodX / foodDist) * attraction - (toDangerX / dangerDist) * repulsion;
        let dirY = (toFoodY / foodDist) * attraction - (toDangerY / dangerDist) * repulsion;
        const dirMag = Math.sqrt(dirX * dirX + dirY * dirY);
        if (dirMag > 0) {
            dirX = (dirX / dirMag) * 40;
            dirY = (dirY / dirMag) * 40;
        }

        svg.innerHTML = `
            <defs>
                <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
                </marker>
                <marker id="arrow-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444"/>
                </marker>
                <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
                </marker>
            </defs>

            <!-- Food (green circle) -->
            <circle cx="${foodPos.x}" cy="${foodPos.y}" r="25" fill="#22c55e" style="cursor: grab;" class="draggable" data-item="food"/>
            <text x="${foodPos.x}" y="${foodPos.y + 5}" text-anchor="middle" fill="white" font-weight="bold" font-size="12" style="pointer-events: none;">FOOD</text>

            <!-- Danger (red circle) -->
            <circle cx="${dangerPos.x}" cy="${dangerPos.y}" r="25" fill="#ef4444" style="cursor: grab;" class="draggable" data-item="danger"/>
            <text x="${dangerPos.x}" y="${dangerPos.y + 5}" text-anchor="middle" fill="white" font-weight="bold" font-size="12" style="pointer-events: none;">HARM</text>

            <!-- Organism (blue circle with direction) -->
            <circle cx="${organismPos.x}" cy="${organismPos.y}" r="20" fill="#3b82f6"/>
            <text x="${organismPos.x}" y="${organismPos.y + 4}" text-anchor="middle" fill="white" font-size="10" style="pointer-events: none;">self</text>

            <!-- Direction arrow from organism -->
            <line x1="${organismPos.x}" y1="${organismPos.y}"
                  x2="${organismPos.x + dirX}" y2="${organismPos.y + dirY}"
                  stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow-blue)"/>

            <!-- "Toward" label near food -->
            <line x1="${organismPos.x + 25}" y1="${organismPos.y}"
                  x2="${foodPos.x - 30}" y2="${foodPos.y}"
                  stroke="#22c55e" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>

            <!-- "Away" label near danger -->
            <line x1="${organismPos.x + 25}" y1="${organismPos.y}"
                  x2="${dangerPos.x - 30}" y2="${dangerPos.y}"
                  stroke="#ef4444" stroke-width="1" stroke-dasharray="4" opacity="0.5"/>
        `;

        // Add drag handlers
        setupDrag();
    }

    function setupDrag() {
        let dragging = null;

        svg.querySelectorAll('.draggable').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                dragging = el.dataset.item;
                e.preventDefault();
            });
        });

        svg.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const rect = svg.getBoundingClientRect();
            const x = Math.max(30, Math.min(width - 30, e.clientX - rect.left));
            const y = Math.max(30, Math.min(height - 30, e.clientY - rect.top));

            if (dragging === 'food') {
                foodPos = { x, y };
            } else if (dragging === 'danger') {
                dangerPos = { x, y };
            }
            render();
        });

        document.addEventListener('mouseup', () => {
            dragging = null;
        });
    }

    render();
}

// ============================================
// VISUAL 2: Six Directions from the Body
// ============================================
function initBodyDirectionsVisual() {
    const container = document.getElementById('body-directions-visual');
    if (!container) return;

    const width = 400;
    const height = 350;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>The body generates directions</strong>
        </div>
        <svg id="body-directions-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; background: #f8fafc; border-radius: 8px;"></svg>
        <div style="text-align: center; margin-top: 10px;">
            <input type="range" id="body-rotation" min="0" max="360" value="0" style="width: 200px;">
            <div style="font-size: 12px; color: #666;">Rotate the figure</div>
        </div>
    `;

    const svg = document.getElementById('body-directions-svg');
    const slider = document.getElementById('body-rotation');

    function render(rotation) {
        const cx = width / 2;
        const cy = height / 2;
        const rad = rotation * Math.PI / 180;

        // Direction vectors (relative to figure)
        const dirs = [
            { name: 'Forward', angle: 0, color: '#3b82f6', dist: 80 },
            { name: 'Back', angle: 180, color: '#94a3b8', dist: 80 },
            { name: 'Left', angle: 90, color: '#8b5cf6', dist: 60 },
            { name: 'Right', angle: -90, color: '#ec4899', dist: 60 },
        ];

        let arrows = '';
        dirs.forEach(d => {
            const a = (d.angle + rotation) * Math.PI / 180;
            const x2 = cx + Math.cos(a) * d.dist;
            const y2 = cy - Math.sin(a) * d.dist;
            arrows += `
                <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}"
                      stroke="${d.color}" stroke-width="3" marker-end="url(#arrow-${d.name.toLowerCase()})"/>
                <text x="${cx + Math.cos(a) * (d.dist + 20)}" y="${cy - Math.sin(a) * (d.dist + 20) + 4}"
                      text-anchor="middle" fill="${d.color}" font-size="12" font-weight="bold">${d.name}</text>
            `;
        });

        // Up and down (fixed relative to gravity)
        arrows += `
            <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 70}"
                  stroke="#22c55e" stroke-width="3" marker-end="url(#arrow-up)"/>
            <text x="${cx}" y="${cy - 85}" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">Up</text>

            <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 70}"
                  stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow-down)"/>
            <text x="${cx}" y="${cy + 95}" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">Down</text>
        `;

        // Simple figure (triangle pointing forward)
        const figSize = 25;
        const p1x = cx + Math.cos(rad) * figSize;
        const p1y = cy - Math.sin(rad) * figSize;
        const p2x = cx + Math.cos(rad + 2.5) * figSize;
        const p2y = cy - Math.sin(rad + 2.5) * figSize;
        const p3x = cx + Math.cos(rad - 2.5) * figSize;
        const p3y = cy - Math.sin(rad - 2.5) * figSize;

        svg.innerHTML = `
            <defs>
                <marker id="arrow-forward" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
                </marker>
                <marker id="arrow-back" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
                </marker>
                <marker id="arrow-left" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6"/>
                </marker>
                <marker id="arrow-right" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899"/>
                </marker>
                <marker id="arrow-up" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
                </marker>
                <marker id="arrow-down" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/>
                </marker>
            </defs>

            <!-- Gravity indicator -->
            <text x="30" y="30" fill="#666" font-size="11">Gravity: ↓</text>

            ${arrows}

            <!-- Figure (triangle) -->
            <polygon points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}"
                     fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
            <circle cx="${cx}" cy="${cy}" r="8" fill="#64748b"/>
        `;
    }

    slider.addEventListener('input', (e) => render(parseFloat(e.target.value)));
    render(0);
}

// ============================================
// VISUAL 3: Circle of Directions (2D)
// ============================================
function initCircleDirectionsVisual() {
    const container = document.getElementById('circle-directions-visual');
    if (!container) return;

    const width = 400;
    const height = 350;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>The circle: all directions in 2D</strong>
        </div>
        <svg id="circle-directions-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; background: #f8fafc; border-radius: 8px;"></svg>
        <div style="text-align: center; margin-top: 10px;">
            <input type="range" id="circle-angle" min="0" max="360" value="45" style="width: 200px;">
            <div id="angle-display" style="font-size: 14px; color: #3b82f6; font-weight: bold;">θ = 45°</div>
        </div>
    `;

    const svg = document.getElementById('circle-directions-svg');
    const slider = document.getElementById('circle-angle');
    const display = document.getElementById('angle-display');

    const cx = width / 2;
    const cy = height / 2;
    const radius = 100;

    function render(angle) {
        const rad = angle * Math.PI / 180;
        const arrowLen = radius + 30;
        const x2 = cx + Math.cos(rad) * arrowLen;
        const y2 = cy - Math.sin(rad) * arrowLen;

        // Cardinal directions
        const cardinals = [
            { label: 'E (0°)', angle: 0 },
            { label: 'N (90°)', angle: 90 },
            { label: 'W (180°)', angle: 180 },
            { label: 'S (270°)', angle: 270 },
        ];

        let cardinalLabels = '';
        cardinals.forEach(c => {
            const r = c.angle * Math.PI / 180;
            const lx = cx + Math.cos(r) * (radius + 50);
            const ly = cy - Math.sin(r) * (radius + 50);
            cardinalLabels += `<text x="${lx}" y="${ly + 4}" text-anchor="middle" fill="#94a3b8" font-size="11">${c.label}</text>`;
        });

        // Draw arc from 0 to current angle
        const arcPath = angle > 0 ? `M ${cx + 30} ${cy} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${cx + Math.cos(rad) * 30} ${cy - Math.sin(rad) * 30}` : '';

        svg.innerHTML = `
            <defs>
                <marker id="circle-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
                </marker>
            </defs>

            <!-- Circle outline -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#e2e8f0" stroke-width="2"/>

            <!-- Tick marks -->
            ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
                const r = a * Math.PI / 180;
                const x1 = cx + Math.cos(r) * (radius - 5);
                const y1 = cy - Math.sin(r) * (radius - 5);
                const x2 = cx + Math.cos(r) * (radius + 5);
                const y2 = cy - Math.sin(r) * (radius + 5);
                return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#cbd5e1" stroke-width="1"/>`;
            }).join('')}

            ${cardinalLabels}

            <!-- Angle arc -->
            <path d="${arcPath}" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.5"/>

            <!-- Center point -->
            <circle cx="${cx}" cy="${cy}" r="5" fill="#1e293b"/>

            <!-- Direction arrow -->
            <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}"
                  stroke="#3b82f6" stroke-width="3" marker-end="url(#circle-arrow)"/>

            <!-- Point on circle -->
            <circle cx="${cx + Math.cos(rad) * radius}" cy="${cy - Math.sin(rad) * radius}" r="6" fill="#3b82f6"/>
        `;

        display.textContent = `θ = ${angle}°`;
    }

    slider.addEventListener('input', (e) => render(parseFloat(e.target.value)));
    render(45);
}

// ============================================
// VISUAL 4: Sphere of Directions (3D)
// ============================================
function initSphereDirectionsVisual() {
    const container = document.getElementById('sphere-directions-visual');
    if (!container) return;

    const width = 450;
    const height = 350;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>The sphere: all directions in 3D</strong>
        </div>
        <svg id="sphere-directions-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; background: #f8fafc; border-radius: 8px;"></svg>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
            <div>
                <label style="font-size: 12px;">Azimuth (θ): </label>
                <input type="range" id="sphere-theta" min="0" max="360" value="45" style="width: 120px;">
                <span id="theta-val" style="font-size: 12px; color: #3b82f6;">45°</span>
            </div>
            <div>
                <label style="font-size: 12px;">Elevation (φ): </label>
                <input type="range" id="sphere-phi" min="-90" max="90" value="30" style="width: 120px;">
                <span id="phi-val" style="font-size: 12px; color: #22c55e;">30°</span>
            </div>
        </div>
    `;

    const svg = document.getElementById('sphere-directions-svg');
    const thetaSlider = document.getElementById('sphere-theta');
    const phiSlider = document.getElementById('sphere-phi');
    const thetaVal = document.getElementById('theta-val');
    const phiVal = document.getElementById('phi-val');

    const cx = width / 2;
    const cy = height / 2;
    const radius = 100;

    // Simple 3D projection
    function project(x, y, z) {
        // Isometric-ish projection
        const px = cx + x * 0.9 - z * 0.3;
        const py = cy - y * 0.8 - z * 0.2;
        return { x: px, y: py };
    }

    function render(theta, phi) {
        const thetaRad = theta * Math.PI / 180;
        const phiRad = phi * Math.PI / 180;

        // 3D position on sphere
        const dx = Math.cos(phiRad) * Math.cos(thetaRad) * radius;
        const dy = Math.sin(phiRad) * radius;
        const dz = Math.cos(phiRad) * Math.sin(thetaRad) * radius;

        const origin = project(0, 0, 0);
        const point = project(dx, dy, dz);

        // Draw sphere outline (ellipses)
        svg.innerHTML = `
            <defs>
                <marker id="sphere-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
                </marker>
            </defs>

            <!-- Horizontal circle (equator) -->
            <ellipse cx="${cx}" cy="${cy}" rx="${radius}" ry="${radius * 0.3}"
                     fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>

            <!-- Vertical circle (meridian) -->
            <ellipse cx="${cx}" cy="${cy}" rx="${radius * 0.3}" ry="${radius}"
                     fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>

            <!-- Main sphere outline -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#cbd5e1" stroke-width="2"/>

            <!-- Axes -->
            <line x1="${cx - radius - 20}" y1="${cy}" x2="${cx + radius + 20}" y2="${cy}" stroke="#94a3b8" stroke-width="1"/>
            <line x1="${cx}" y1="${cy + radius + 20}" x2="${cx}" y2="${cy - radius - 20}" stroke="#94a3b8" stroke-width="1"/>

            <!-- Axis labels -->
            <text x="${cx + radius + 30}" y="${cy + 4}" fill="#94a3b8" font-size="12">X</text>
            <text x="${cx + 4}" y="${cy - radius - 25}" fill="#94a3b8" font-size="12">Y (up)</text>

            <!-- North/South poles -->
            <circle cx="${cx}" cy="${cy - radius}" r="4" fill="#22c55e"/>
            <text x="${cx + 10}" y="${cy - radius + 4}" fill="#22c55e" font-size="10">N</text>
            <circle cx="${cx}" cy="${cy + radius}" r="4" fill="#f59e0b"/>
            <text x="${cx + 10}" y="${cy + radius + 4}" fill="#f59e0b" font-size="10">S</text>

            <!-- Center point -->
            <circle cx="${origin.x}" cy="${origin.y}" r="4" fill="#1e293b"/>

            <!-- Direction arrow -->
            <line x1="${origin.x}" y1="${origin.y}" x2="${point.x}" y2="${point.y}"
                  stroke="#3b82f6" stroke-width="3" marker-end="url(#sphere-arrow)"/>

            <!-- Point on sphere -->
            <circle cx="${point.x}" cy="${point.y}" r="6" fill="#3b82f6"/>

            <!-- Elevation arc indicator -->
            <text x="${cx - radius - 40}" y="${cy}" fill="#666" font-size="10">φ = ${phi}°</text>
            <text x="${cx}" y="${cy + radius + 40}" fill="#666" font-size="10">θ = ${theta}°</text>
        `;

        thetaVal.textContent = theta + '°';
        phiVal.textContent = phi + '°';
    }

    thetaSlider.addEventListener('input', () => render(parseFloat(thetaSlider.value), parseFloat(phiSlider.value)));
    phiSlider.addEventListener('input', () => render(parseFloat(thetaSlider.value), parseFloat(phiSlider.value)));
    render(45, 30);
}

// ============================================
// VISUAL 5: Combining Directions
// ============================================
function initCombiningDirectionsVisual() {
    const container = document.getElementById('combining-directions-visual');
    if (!container) return;

    const width = 500;
    const height = 300;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>How do two directions relate?</strong>
        </div>
        <svg id="combining-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; background: #f8fafc; border-radius: 8px;"></svg>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px;">
            <div>
                <label style="font-size: 12px; color: #3b82f6;">Direction A: </label>
                <input type="range" id="dir-a" min="0" max="360" value="30" style="width: 100px;">
            </div>
            <div>
                <label style="font-size: 12px; color: #22c55e;">Direction B: </label>
                <input type="range" id="dir-b" min="0" max="360" value="60" style="width: 100px;">
            </div>
        </div>
        <div id="relationship-text" style="text-align: center; margin-top: 10px; font-size: 14px; padding: 10px; border-radius: 8px;"></div>
    `;

    const svg = document.getElementById('combining-svg');
    const sliderA = document.getElementById('dir-a');
    const sliderB = document.getElementById('dir-b');
    const relText = document.getElementById('relationship-text');

    const cx = width / 2;
    const cy = height / 2;
    const arrowLen = 80;

    function render(angleA, angleB) {
        const radA = angleA * Math.PI / 180;
        const radB = angleB * Math.PI / 180;

        const ax = cx + Math.cos(radA) * arrowLen;
        const ay = cy - Math.sin(radA) * arrowLen;
        const bx = cx + Math.cos(radB) * arrowLen;
        const by = cy - Math.sin(radB) * arrowLen;

        // Calculate angle between them
        let diff = Math.abs(angleA - angleB);
        if (diff > 180) diff = 360 - diff;

        // Determine relationship
        let relationship, bgColor, textColor;
        if (diff < 15) {
            relationship = "SAME — they reinforce each other";
            bgColor = "#dcfce7";
            textColor = "#166534";
        } else if (diff > 165) {
            relationship = "OPPOSITE — they cancel each other";
            bgColor = "#fee2e2";
            textColor = "#991b1b";
        } else if (diff > 75 && diff < 105) {
            relationship = "PERPENDICULAR — they're independent";
            bgColor = "#dbeafe";
            textColor = "#1e40af";
        } else {
            relationship = `OBLIQUE (${diff}°) — partial alignment`;
            bgColor = "#fef3c7";
            textColor = "#92400e";
        }

        // Draw arc between the two directions
        const arcRadius = 40;
        const startAngle = Math.min(radA, radB);
        const endAngle = Math.max(radA, radB);

        svg.innerHTML = `
            <defs>
                <marker id="arrow-a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
                </marker>
                <marker id="arrow-b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
                </marker>
            </defs>

            <!-- Reference circle -->
            <circle cx="${cx}" cy="${cy}" r="${arrowLen + 20}" fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4"/>

            <!-- Angle arc -->
            <path d="M ${cx + Math.cos(radA) * arcRadius} ${cy - Math.sin(radA) * arcRadius}
                     A ${arcRadius} ${arcRadius} 0 ${diff > 180 ? 1 : 0} ${angleB > angleA ? 0 : 1}
                     ${cx + Math.cos(radB) * arcRadius} ${cy - Math.sin(radB) * arcRadius}"
                  fill="none" stroke="#f59e0b" stroke-width="2"/>

            <!-- Angle label -->
            <text x="${cx + Math.cos((radA + radB) / 2) * (arcRadius + 15)}"
                  y="${cy - Math.sin((radA + radB) / 2) * (arcRadius + 15)}"
                  fill="#f59e0b" font-size="12" text-anchor="middle">${diff}°</text>

            <!-- Center point -->
            <circle cx="${cx}" cy="${cy}" r="5" fill="#1e293b"/>

            <!-- Direction A -->
            <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}"
                  stroke="#3b82f6" stroke-width="4" marker-end="url(#arrow-a)"/>
            <text x="${ax + 15}" y="${ay}" fill="#3b82f6" font-size="14" font-weight="bold">A</text>

            <!-- Direction B -->
            <line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}"
                  stroke="#22c55e" stroke-width="4" marker-end="url(#arrow-b)"/>
            <text x="${bx + 15}" y="${by}" fill="#22c55e" font-size="14" font-weight="bold">B</text>
        `;

        relText.style.background = bgColor;
        relText.style.color = textColor;
        relText.textContent = relationship;
    }

    sliderA.addEventListener('input', () => render(parseFloat(sliderA.value), parseFloat(sliderB.value)));
    sliderB.addEventListener('input', () => render(parseFloat(sliderA.value), parseFloat(sliderB.value)));
    render(30, 60);
}

// ============================================
// VISUAL 6: Gradient Direction
// ============================================
function initGradientVisual() {
    const container = document.getElementById('gradient-visual');
    if (!container) return;

    const width = 450;
    const height = 350;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>Click anywhere to see the gradient (steepest uphill direction)</strong>
        </div>
        <svg id="gradient-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; border-radius: 8px; cursor: crosshair;"></svg>
        <div style="text-align: center; margin-top: 10px; font-size: 12px; color: #666;">
            Color shows height (red = high, blue = low). Arrow shows gradient direction.
        </div>
    `;

    const svg = document.getElementById('gradient-svg');
    const gridSize = 20;
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    // Height function: a nice smooth hill
    function height(x, y) {
        const cx1 = width * 0.3, cy1 = height * 0.4;
        const cx2 = width * 0.7, cy2 = height * 0.6;

        const d1 = Math.sqrt((x - cx1) ** 2 + (y - cy1) ** 2);
        const d2 = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);

        return Math.exp(-d1 * d1 / 15000) * 0.8 + Math.exp(-d2 * d2 / 20000) * 0.6;
    }

    // Gradient (numerical)
    function gradient(x, y) {
        const eps = 2;
        const dhdx = (height(x + eps, y) - height(x - eps, y)) / (2 * eps);
        const dhdy = (height(x, y + eps) - height(x, y - eps)) / (2 * eps);
        return { dx: dhdx, dy: dhdy };
    }

    // Color interpolation
    function heightColor(h) {
        // Blue (low) to green to red (high)
        const r = Math.floor(255 * h);
        const g = Math.floor(255 * (1 - Math.abs(h - 0.5) * 2));
        const b = Math.floor(255 * (1 - h));
        return `rgb(${r},${g},${b})`;
    }

    let clickX = width / 2, clickY = height / 2;

    function render() {
        let rects = '';
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * gridSize + gridSize / 2;
                const y = j * gridSize + gridSize / 2;
                const h = height(x, y);
                rects += `<rect x="${i * gridSize}" y="${j * gridSize}" width="${gridSize}" height="${gridSize}" fill="${heightColor(h)}" opacity="0.7"/>`;
            }
        }

        // Gradient at click point
        const g = gradient(clickX, clickY);
        const mag = Math.sqrt(g.dx * g.dx + g.dy * g.dy);
        const arrowLen = Math.min(60, mag * 3000);

        let gx = 0, gy = 0;
        if (mag > 0.0001) {
            gx = (g.dx / mag) * arrowLen;
            gy = -(g.dy / mag) * arrowLen; // Negative because SVG y is inverted
        }

        svg.innerHTML = `
            <defs>
                <marker id="grad-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff"/>
                </marker>
            </defs>

            ${rects}

            <!-- Click point -->
            <circle cx="${clickX}" cy="${clickY}" r="8" fill="none" stroke="white" stroke-width="3"/>
            <circle cx="${clickX}" cy="${clickY}" r="8" fill="none" stroke="black" stroke-width="1"/>

            <!-- Gradient arrow (points uphill) -->
            <line x1="${clickX}" y1="${clickY}" x2="${clickX + gx}" y2="${clickY + gy}"
                  stroke="white" stroke-width="4" marker-end="url(#grad-arrow)"/>
            <line x1="${clickX}" y1="${clickY}" x2="${clickX + gx}" y2="${clickY + gy}"
                  stroke="black" stroke-width="1"/>

            <!-- Label -->
            <text x="${clickX + gx + 10}" y="${clickY + gy}" fill="white" font-size="12"
                  stroke="black" stroke-width="0.5">uphill</text>
        `;
    }

    svg.addEventListener('click', (e) => {
        const rect = svg.getBoundingClientRect();
        clickX = e.clientX - rect.left;
        clickY = e.clientY - rect.top;
        render();
    });

    render();
}

// ============================================
// VISUAL 7: Direction in Causation
// ============================================
function initCausationVisual() {
    const container = document.getElementById('causation-visual');
    if (!container) return;

    const width = 500;
    const height = 200;

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <strong>Causation has direction: cause → effect</strong>
        </div>
        <svg id="causation-svg" width="${width}" height="${height}" style="display: block; margin: 0 auto; background: #f8fafc; border-radius: 8px;"></svg>
        <div style="text-align: center; margin-top: 10px;">
            <button id="reaction-btn" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Chemical Reaction</button>
            <button id="reasoning-btn" style="padding: 8px 16px; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer;">Logical Reasoning</button>
        </div>
    `;

    const svg = document.getElementById('causation-svg');
    const reactionBtn = document.getElementById('reaction-btn');
    const reasoningBtn = document.getElementById('reasoning-btn');

    const chains = {
        reaction: ['Nucleophile', 'attacks', 'Electrophile', 'forms', 'Transition State', 'yields', 'Product'],
        reasoning: ['Premise A', 'and', 'Premise B', 'therefore', 'Conclusion', '', '']
    };

    function render(type) {
        const chain = chains[type];
        const color = type === 'reaction' ? '#3b82f6' : '#22c55e';

        const nodeCount = chain.filter((_, i) => i % 2 === 0 && chain[i]).length;
        const spacing = width / (nodeCount + 1);

        let elements = '';
        let x = spacing;

        for (let i = 0; i < chain.length; i += 2) {
            if (!chain[i]) break;

            // Node
            elements += `
                <rect x="${x - 50}" y="80" width="100" height="40" rx="5" fill="${color}" opacity="0.9"/>
                <text x="${x}" y="105" text-anchor="middle" fill="white" font-size="11" font-weight="bold">${chain[i]}</text>
            `;

            // Arrow to next (if exists)
            if (chain[i + 2]) {
                const nextX = x + spacing;
                elements += `
                    <line x1="${x + 50}" y1="100" x2="${nextX - 55}" y2="100"
                          stroke="${color}" stroke-width="2" marker-end="url(#cause-arrow)"/>
                    <text x="${(x + nextX) / 2}" y="75" text-anchor="middle" fill="#666" font-size="10">${chain[i + 1]}</text>
                `;
            }

            x += spacing;
        }

        svg.innerHTML = `
            <defs>
                <marker id="cause-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="${color}"/>
                </marker>
            </defs>

            <!-- Time arrow at top -->
            <line x1="50" y1="30" x2="${width - 50}" y2="30" stroke="#94a3b8" stroke-width="1" marker-end="url(#time-arrow)"/>
            <text x="${width / 2}" y="20" text-anchor="middle" fill="#94a3b8" font-size="11">time / logical order →</text>

            <defs>
                <marker id="time-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/>
                </marker>
            </defs>

            ${elements}

            <!-- Note at bottom -->
            <text x="${width / 2}" y="160" text-anchor="middle" fill="#666" font-size="11">
                Effects cannot precede causes. The arrow of causation is the arrow of time.
            </text>
        `;
    }

    reactionBtn.addEventListener('click', () => render('reaction'));
    reasoningBtn.addEventListener('click', () => render('reasoning'));

    render('reaction');
}
