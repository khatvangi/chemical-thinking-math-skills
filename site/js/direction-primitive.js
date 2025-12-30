/**
 * DIRECTION: The Primitive
 * Interactive visualizations for cognitive direction exploration
 */

document.addEventListener('DOMContentLoaded', function() {
    initParticleCanvas();
    initScrollEffects();
    initSectionNav();
    initPointingArm();
    initTowardAway();
    initBodyDirections();
    initCircleDirections();
    initSphereDirections();
    initComparingDirections();
    initMagnitudeSlider();
    initGradientLandscape();
    initCausationFlow();
    initBridgeAnimation();
});

// ============================================
// PARTICLE CANVAS (Hero Background)
// ============================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(88, 166, 255, 0.5)';
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(88, 166, 255, ${0.15 * (1 - dist / connectionDistance)})`;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    animate();
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    // Scroll progress bar
    const progressBar = document.getElementById('scroll-progress');

    // Reveal sections on scroll
    const sections = document.querySelectorAll('.prose-section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Update progress bar
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    });

    // Smooth scroll for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('.prose-section');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ============================================
// SECTION NAVIGATION
// ============================================
function initSectionNav() {
    const nav = document.getElementById('section-nav');
    const sections = document.querySelectorAll('.prose-section');

    if (!nav || sections.length === 0) return;

    // Create nav dots
    sections.forEach((section, i) => {
        const dot = document.createElement('div');
        dot.className = 'section-nav-dot';
        dot.title = section.querySelector('h2')?.textContent || `Section ${i + 1}`;
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        nav.appendChild(dot);
    });

    // Update active dot on scroll
    const dots = nav.querySelectorAll('.section-nav-dot');
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ============================================
// POINTING ARM INTERACTIVE
// ============================================
function initPointingArm() {
    const container = document.getElementById('pointing-arm');
    if (!container) return;

    const width = 350;
    const height = 280;
    const centerX = width * 0.3;
    const centerY = height * 0.5;
    let targetX = width * 0.75;
    let targetY = height * 0.35;
    let isDragging = false;

    container.innerHTML = `
        <svg width="${width}" height="${height}" style="cursor: crosshair;">
            <defs>
                <marker id="arm-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#58A6FF"/>
                </marker>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g id="pointing-arm-group"></g>
        </svg>
        <div class="interactive-instruction">Drag the target anywhere</div>
    `;

    const svg = container.querySelector('svg');
    const group = document.getElementById('pointing-arm-group');

    function render() {
        // Calculate direction
        const dx = targetX - centerX;
        const dy = targetY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const armLength = Math.min(dist * 0.7, 100);
        const armX = centerX + (dx / dist) * armLength;
        const armY = centerY + (dy / dist) * armLength;

        group.innerHTML = `
            <!-- You (origin) -->
            <circle cx="${centerX}" cy="${centerY}" r="20" fill="#1e293b" filter="url(#glow)"/>
            <text x="${centerX}" y="${centerY + 5}" text-anchor="middle" fill="#E6EDF3" font-size="12" font-weight="500">you</text>

            <!-- Arm pointing -->
            <line x1="${centerX}" y1="${centerY}" x2="${armX}" y2="${armY}"
                  stroke="#58A6FF" stroke-width="4" stroke-linecap="round"
                  marker-end="url(#arm-arrow)"/>

            <!-- Target -->
            <circle cx="${targetX}" cy="${targetY}" r="15" fill="#7EE787" style="cursor: grab;" class="target"/>
            <text x="${targetX}" y="${targetY + 30}" text-anchor="middle" fill="#8B949E" font-size="11">target</text>

            <!-- Dashed line to target -->
            <line x1="${armX + 15}" y1="${armY}" x2="${targetX - 18}" y2="${targetY}"
                  stroke="#58A6FF" stroke-width="1" stroke-dasharray="4" opacity="0.4"/>
        `;

        // Add drag handlers
        const target = group.querySelector('.target');
        target.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
    }

    svg.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = svg.getBoundingClientRect();
        targetX = Math.max(50, Math.min(width - 20, e.clientX - rect.left));
        targetY = Math.max(20, Math.min(height - 40, e.clientY - rect.top));
        render();
    });

    document.addEventListener('mouseup', () => isDragging = false);

    render();
}

// ============================================
// TOWARD / AWAY INTERACTIVE
// ============================================
function initTowardAway() {
    const container = document.getElementById('toward-away');
    if (!container) return;

    const width = 600;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    let foodX = 150, foodY = 150;
    let dangerX = 450, dangerY = 150;
    let dragging = null;

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <defs>
                <marker id="toward-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#7EE787"/>
                </marker>
                <marker id="away-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#F78166"/>
                </marker>
                <radialGradient id="organism-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#58A6FF" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#58A6FF" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <g id="toward-away-group"></g>
        </svg>
        <div class="interactive-label">
            The ur-direction: <span style="color: #7EE787;">toward</span> what helps,
            <span style="color: #F78166;">away from</span> what harms
        </div>
        <div class="interactive-instruction">Drag the food and danger</div>
    `;

    const svg = container.querySelector('svg');
    const group = document.getElementById('toward-away-group');

    function render() {
        // Calculate directions
        const toFoodDx = foodX - centerX;
        const toFoodDy = foodY - centerY;
        const foodDist = Math.sqrt(toFoodDx * toFoodDx + toFoodDy * toFoodDy);

        const toDangerDx = dangerX - centerX;
        const toDangerDy = dangerY - centerY;
        const dangerDist = Math.sqrt(toDangerDx * toDangerDx + toDangerDy * toDangerDy);

        // Arrow lengths (toward food, away from danger)
        const towardLen = 60;
        const awayLen = 60;

        const towardEndX = centerX + (toFoodDx / foodDist) * towardLen;
        const towardEndY = centerY + (toFoodDy / foodDist) * towardLen;

        const awayEndX = centerX - (toDangerDx / dangerDist) * awayLen;
        const awayEndY = centerY - (toDangerDy / dangerDist) * awayLen;

        group.innerHTML = `
            <!-- Glow behind organism -->
            <circle cx="${centerX}" cy="${centerY}" r="60" fill="url(#organism-glow)"/>

            <!-- Food (good) -->
            <circle cx="${foodX}" cy="${foodY}" r="30" fill="#22c55e" style="cursor: grab;" class="draggable" data-item="food"/>
            <text x="${foodX}" y="${foodY}" text-anchor="middle" dy="5" fill="white" font-size="20">🍎</text>
            <text x="${foodX}" y="${foodY + 45}" text-anchor="middle" fill="#7EE787" font-size="11">GOOD</text>

            <!-- Danger (bad) -->
            <circle cx="${dangerX}" cy="${dangerY}" r="30" fill="#dc2626" style="cursor: grab;" class="draggable" data-item="danger"/>
            <text x="${dangerX}" y="${dangerY}" text-anchor="middle" dy="5" fill="white" font-size="20">☠️</text>
            <text x="${dangerX}" y="${dangerY + 45}" text-anchor="middle" fill="#F78166" font-size="11">BAD</text>

            <!-- Organism -->
            <circle cx="${centerX}" cy="${centerY}" r="25" fill="#1e293b" stroke="#58A6FF" stroke-width="2"/>
            <text x="${centerX}" y="${centerY + 5}" text-anchor="middle" fill="#E6EDF3" font-size="11">organism</text>

            <!-- Toward arrow (to food) -->
            <line x1="${centerX}" y1="${centerY}" x2="${towardEndX}" y2="${towardEndY}"
                  stroke="#7EE787" stroke-width="4" marker-end="url(#toward-arrow)"/>
            <text x="${(centerX + towardEndX) / 2 + 15}" y="${(centerY + towardEndY) / 2}"
                  fill="#7EE787" font-size="10" font-weight="bold">TOWARD</text>

            <!-- Away arrow (from danger) -->
            <line x1="${centerX}" y1="${centerY}" x2="${awayEndX}" y2="${awayEndY}"
                  stroke="#F78166" stroke-width="4" marker-end="url(#away-arrow)"/>
            <text x="${(centerX + awayEndX) / 2 - 15}" y="${(centerY + awayEndY) / 2}"
                  fill="#F78166" font-size="10" font-weight="bold">AWAY</text>
        `;

        // Re-attach drag handlers
        group.querySelectorAll('.draggable').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                dragging = el.dataset.item;
                e.preventDefault();
            });
        });
    }

    svg.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const rect = svg.getBoundingClientRect();
        const x = Math.max(40, Math.min(width - 40, e.clientX - rect.left));
        const y = Math.max(40, Math.min(height - 40, e.clientY - rect.top));

        if (dragging === 'food') {
            foodX = x;
            foodY = y;
        } else if (dragging === 'danger') {
            dangerX = x;
            dangerY = y;
        }
        render();
    });

    document.addEventListener('mouseup', () => dragging = null);
    render();
}

// ============================================
// BODY DIRECTIONS INTERACTIVE
// ============================================
function initBodyDirections() {
    const container = document.getElementById('body-directions');
    if (!container) return;

    const width = 500;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2;
    let rotation = 0;

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <defs>
                <marker id="body-arrow-forward" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#58A6FF"/>
                </marker>
                <marker id="body-arrow-back" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#8B949E"/>
                </marker>
                <marker id="body-arrow-left" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#a855f7"/>
                </marker>
                <marker id="body-arrow-right" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#ec4899"/>
                </marker>
                <marker id="body-arrow-up" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#7EE787"/>
                </marker>
                <marker id="body-arrow-down" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#F78166"/>
                </marker>
            </defs>
            <g id="body-directions-group"></g>
        </svg>
        <div style="text-align: center; margin-top: 1rem;">
            <input type="range" id="body-rotation-slider" min="0" max="360" value="0" style="width: 250px;">
            <div class="interactive-label">Rotate the figure — notice what moves and what stays fixed</div>
        </div>
    `;

    const group = document.getElementById('body-directions-group');
    const slider = document.getElementById('body-rotation-slider');

    function render() {
        const rad = rotation * Math.PI / 180;

        // Directions that rotate with body
        const bodyDirs = [
            { name: 'FORWARD', angle: 0, color: '#58A6FF', marker: 'forward', len: 90 },
            { name: 'BACK', angle: 180, color: '#8B949E', marker: 'back', len: 70 },
            { name: 'LEFT', angle: 90, color: '#a855f7', marker: 'left', len: 60 },
            { name: 'RIGHT', angle: -90, color: '#ec4899', marker: 'right', len: 60 }
        ];

        let arrows = '';

        // Body-relative arrows
        bodyDirs.forEach(d => {
            const a = (d.angle + rotation) * Math.PI / 180;
            const x2 = cx + Math.cos(a) * d.len;
            const y2 = cy - Math.sin(a) * d.len;
            const labelX = cx + Math.cos(a) * (d.len + 25);
            const labelY = cy - Math.sin(a) * (d.len + 25);

            arrows += `
                <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}"
                      stroke="${d.color}" stroke-width="3" marker-end="url(#body-arrow-${d.marker})"/>
                <text x="${labelX}" y="${labelY + 4}" text-anchor="middle"
                      fill="${d.color}" font-size="11" font-weight="bold">${d.name}</text>
            `;
        });

        // Fixed arrows (gravity-relative)
        arrows += `
            <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 80}"
                  stroke="#7EE787" stroke-width="3" marker-end="url(#body-arrow-up)"/>
            <text x="${cx}" y="${cy - 95}" text-anchor="middle" fill="#7EE787" font-size="11" font-weight="bold">UP</text>
            <text x="${cx + 35}" y="${cy - 85}" fill="#7EE787" font-size="9">(fixed)</text>

            <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 80}"
                  stroke="#F78166" stroke-width="3" marker-end="url(#body-arrow-down)"/>
            <text x="${cx}" y="${cy + 100}" text-anchor="middle" fill="#F78166" font-size="11" font-weight="bold">DOWN</text>
            <text x="${cx + 35}" y="${cy + 90}" fill="#F78166" font-size="9">(fixed)</text>
        `;

        // Draw figure (triangle pointing forward)
        const figSize = 30;
        const p1x = cx + Math.cos(rad) * figSize;
        const p1y = cy - Math.sin(rad) * figSize;
        const p2x = cx + Math.cos(rad + 2.4) * figSize * 0.7;
        const p2y = cy - Math.sin(rad + 2.4) * figSize * 0.7;
        const p3x = cx + Math.cos(rad - 2.4) * figSize * 0.7;
        const p3y = cy - Math.sin(rad - 2.4) * figSize * 0.7;

        group.innerHTML = `
            <!-- Gravity indicator -->
            <text x="30" y="30" fill="#8B949E" font-size="12">gravity ↓</text>

            ${arrows}

            <!-- Figure -->
            <polygon points="${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}"
                     fill="#1e293b" stroke="#58A6FF" stroke-width="2"/>
            <circle cx="${cx}" cy="${cy}" r="8" fill="#58A6FF"/>
        `;
    }

    slider.addEventListener('input', (e) => {
        rotation = parseFloat(e.target.value);
        render();
    });

    render();
}

// ============================================
// CIRCLE OF DIRECTIONS INTERACTIVE
// ============================================
function initCircleDirections() {
    const container = document.getElementById('circle-directions');
    if (!container) return;

    const width = 450;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2 - 20;
    const radius = 120;
    let angle = 45;
    let isDragging = false;

    container.innerHTML = `
        <svg width="${width}" height="${height}" style="cursor: pointer;">
            <defs>
                <marker id="circle-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#58A6FF"/>
                </marker>
                <linearGradient id="circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#667eea" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#764ba2" stop-opacity="0.3"/>
                </linearGradient>
            </defs>
            <g id="circle-directions-group"></g>
        </svg>
        <div style="text-align: center;">
            <input type="range" id="circle-angle-slider" min="0" max="360" value="45" style="width: 280px;">
            <div id="circle-angle-display" style="font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; color: #58A6FF; margin-top: 0.5rem;">θ = 45°</div>
        </div>
    `;

    const svg = container.querySelector('svg');
    const group = document.getElementById('circle-directions-group');
    const slider = document.getElementById('circle-angle-slider');
    const display = document.getElementById('circle-angle-display');

    function render() {
        const rad = angle * Math.PI / 180;
        const arrowLen = radius + 35;

        // Arrow endpoint
        const ax = cx + Math.cos(rad) * arrowLen;
        const ay = cy - Math.sin(rad) * arrowLen;

        // Point on circle
        const px = cx + Math.cos(rad) * radius;
        const py = cy - Math.sin(rad) * radius;

        // Cardinal labels
        const cardinals = [
            { label: 'E (0°)', angle: 0 },
            { label: 'N (90°)', angle: 90 },
            { label: 'W (180°)', angle: 180 },
            { label: 'S (270°)', angle: 270 }
        ];

        let cardinalLabels = '';
        cardinals.forEach(c => {
            const r = c.angle * Math.PI / 180;
            const lx = cx + Math.cos(r) * (radius + 55);
            const ly = cy - Math.sin(r) * (radius + 55);
            const isActive = Math.abs(angle - c.angle) < 10 || Math.abs(angle - c.angle - 360) < 10;
            cardinalLabels += `
                <text x="${lx}" y="${ly + 4}" text-anchor="middle"
                      fill="${isActive ? '#58A6FF' : '#8B949E'}" font-size="11"
                      font-weight="${isActive ? 'bold' : 'normal'}">${c.label}</text>
            `;
        });

        // Tick marks
        let ticks = '';
        for (let t = 0; t < 360; t += 30) {
            const r = t * Math.PI / 180;
            const x1 = cx + Math.cos(r) * (radius - 5);
            const y1 = cy - Math.sin(r) * (radius - 5);
            const x2 = cx + Math.cos(r) * (radius + 5);
            const y2 = cy - Math.sin(r) * (radius + 5);
            ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8B949E" stroke-width="1"/>`;
        }

        // Angle arc
        const arcEndX = cx + Math.cos(rad) * 40;
        const arcEndY = cy - Math.sin(rad) * 40;
        const largeArc = angle > 180 ? 1 : 0;

        group.innerHTML = `
            <!-- Circle fill -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#circle-gradient)"/>

            <!-- Circle outline -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#8B949E" stroke-width="2" opacity="0.5"/>

            ${ticks}
            ${cardinalLabels}

            <!-- Angle arc -->
            <path d="M ${cx + 40} ${cy} A 40 40 0 ${largeArc} 0 ${arcEndX} ${arcEndY}"
                  fill="none" stroke="#58A6FF" stroke-width="2" opacity="0.6"/>

            <!-- Center point -->
            <circle cx="${cx}" cy="${cy}" r="6" fill="#1e293b" stroke="#58A6FF" stroke-width="2"/>

            <!-- Direction arrow -->
            <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}"
                  stroke="#58A6FF" stroke-width="4" marker-end="url(#circle-arrow)"/>

            <!-- Point on circle (draggable) -->
            <circle cx="${px}" cy="${py}" r="10" fill="#58A6FF" style="cursor: grab;" class="circle-handle"/>
        `;

        display.textContent = `θ = ${Math.round(angle)}°`;

        // Drag handler
        const handle = group.querySelector('.circle-handle');
        handle.addEventListener('mousedown', () => isDragging = true);
    }

    svg.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = svg.getBoundingClientRect();
        const mx = e.clientX - rect.left - cx;
        const my = -(e.clientY - rect.top - cy);
        angle = (Math.atan2(my, mx) * 180 / Math.PI + 360) % 360;
        slider.value = angle;
        render();
    });

    document.addEventListener('mouseup', () => isDragging = false);

    slider.addEventListener('input', (e) => {
        angle = parseFloat(e.target.value);
        render();
    });

    render();
}

// ============================================
// SPHERE OF DIRECTIONS (3D)
// ============================================
function initSphereDirections() {
    const container = document.getElementById('sphere-directions');
    if (!container) return;

    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #8B949E;">3D visualization requires Three.js</p>
                <p style="color: #58A6FF; font-size: 0.9rem;">The sphere represents all possible directions in 3D space.</p>
            </div>
        `;
        return;
    }

    const width = 500;
    const height = 350;

    container.innerHTML = `
        <div id="sphere-canvas" style="width: ${width}px; height: ${height}px; margin: 0 auto;"></div>
        <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1rem;">
            <div>
                <label style="font-size: 0.875rem; color: #8B949E;">Azimuth (θ): </label>
                <input type="range" id="sphere-theta" min="0" max="360" value="45" style="width: 120px;">
                <span id="theta-value" style="font-family: 'JetBrains Mono'; color: #58A6FF;">45°</span>
            </div>
            <div>
                <label style="font-size: 0.875rem; color: #8B949E;">Elevation (φ): </label>
                <input type="range" id="sphere-phi" min="-90" max="90" value="30" style="width: 120px;">
                <span id="phi-value" style="font-family: 'JetBrains Mono'; color: #7EE787;">30°</span>
            </div>
        </div>
        <div class="interactive-instruction">Drag to rotate view</div>
    `;

    const canvasContainer = document.getElementById('sphere-canvas');
    const thetaSlider = document.getElementById('sphere-theta');
    const phiSlider = document.getElementById('sphere-phi');
    const thetaValue = document.getElementById('theta-value');
    const phiValue = document.getElementById('phi-value');

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);

    // Sphere wireframe
    const sphereGeo = new THREE.SphereGeometry(1, 24, 18);
    const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x58A6FF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Equator ring
    const equatorGeo = new THREE.RingGeometry(0.98, 1.02, 64);
    const equatorMat = new THREE.MeshBasicMaterial({ color: 0x8B949E, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2;
    scene.add(equator);

    // Direction arrow
    const arrowDir = new THREE.Vector3(1, 0, 0);
    const arrowOrigin = new THREE.Vector3(0, 0, 0);
    const arrowLength = 1.5;
    const arrowColor = 0x58A6FF;
    const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, arrowColor, 0.2, 0.1);
    scene.add(arrow);

    // Point on sphere
    const pointGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pointMat = new THREE.MeshBasicMaterial({ color: 0x58A6FF });
    const point = new THREE.Mesh(pointGeo, pointMat);
    scene.add(point);

    // Poles
    const poleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const northPole = new THREE.Mesh(poleGeo, new THREE.MeshBasicMaterial({ color: 0x7EE787 }));
    northPole.position.set(0, 1, 0);
    scene.add(northPole);

    const southPole = new THREE.Mesh(poleGeo, new THREE.MeshBasicMaterial({ color: 0xF78166 }));
    southPole.position.set(0, -1, 0);
    scene.add(southPole);

    camera.position.set(2.5, 1.5, 2.5);
    camera.lookAt(0, 0, 0);

    // Simple orbit controls (manual)
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotX = 0.3, rotY = 0.5;

    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
        prevX = e.clientX;
        prevY = e.clientY;
        updateCamera();
    });

    document.addEventListener('mouseup', () => isDragging = false);

    function updateCamera() {
        const radius = 3.5;
        camera.position.x = radius * Math.cos(rotX) * Math.sin(rotY);
        camera.position.y = radius * Math.sin(rotX);
        camera.position.z = radius * Math.cos(rotX) * Math.cos(rotY);
        camera.lookAt(0, 0, 0);
    }

    function updateArrow() {
        const theta = parseFloat(thetaSlider.value) * Math.PI / 180;
        const phi = parseFloat(phiSlider.value) * Math.PI / 180;

        const x = Math.cos(phi) * Math.cos(theta);
        const y = Math.sin(phi);
        const z = Math.cos(phi) * Math.sin(theta);

        arrow.setDirection(new THREE.Vector3(x, y, z).normalize());
        point.position.set(x, y, z);

        thetaValue.textContent = thetaSlider.value + '°';
        phiValue.textContent = phiSlider.value + '°';
    }

    thetaSlider.addEventListener('input', updateArrow);
    phiSlider.addEventListener('input', updateArrow);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    updateCamera();
    updateArrow();
    animate();
}

// ============================================
// COMPARING DIRECTIONS INTERACTIVE
// ============================================
function initComparingDirections() {
    const container = document.getElementById('comparing-directions');
    if (!container) return;

    const width = 550;
    const height = 350;
    const cx = width / 2;
    const cy = 150;
    let angleA = 30;
    let angleB = 75;
    let dragging = null;

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <defs>
                <marker id="compare-arrow-a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#58A6FF"/>
                </marker>
                <marker id="compare-arrow-b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#F78166"/>
                </marker>
            </defs>
            <g id="comparing-group"></g>
        </svg>
        <div id="relationship-display"></div>
        <div class="preset-buttons">
            <button class="preset-button" data-a="0" data-b="0">Same (0°)</button>
            <button class="preset-button" data-a="0" data-b="90">Perpendicular (90°)</button>
            <button class="preset-button" data-a="0" data-b="180">Opposite (180°)</button>
            <button class="preset-button" data-a="30" data-b="75">Oblique (45°)</button>
        </div>
        <div class="interactive-instruction">Drag the arrow heads or use presets</div>
    `;

    const svg = container.querySelector('svg');
    const group = document.getElementById('comparing-group');
    const display = document.getElementById('relationship-display');
    const arrowLen = 90;

    function render() {
        const radA = angleA * Math.PI / 180;
        const radB = angleB * Math.PI / 180;

        const ax = cx + Math.cos(radA) * arrowLen;
        const ay = cy - Math.sin(radA) * arrowLen;
        const bx = cx + Math.cos(radB) * arrowLen;
        const by = cy - Math.sin(radB) * arrowLen;

        // Calculate angle between
        let diff = Math.abs(angleA - angleB);
        if (diff > 180) diff = 360 - diff;

        // Relationship
        const cosAngle = Math.cos(diff * Math.PI / 180);
        let relationship, bgColor, textColor, fillWidth;

        if (diff < 10) {
            relationship = "SAME — they reinforce";
            bgColor = "rgba(126, 231, 135, 0.2)";
            textColor = "#7EE787";
            fillWidth = 100;
        } else if (diff > 170) {
            relationship = "OPPOSITE — they cancel";
            bgColor = "rgba(247, 129, 102, 0.2)";
            textColor = "#F78166";
            fillWidth = 0;
        } else if (diff > 80 && diff < 100) {
            relationship = "PERPENDICULAR — independent";
            bgColor = "rgba(88, 166, 255, 0.2)";
            textColor = "#58A6FF";
            fillWidth = 50;
        } else {
            relationship = `OBLIQUE (${Math.round(diff)}°) — partial alignment`;
            bgColor = "rgba(139, 148, 158, 0.2)";
            textColor = "#8B949E";
            fillWidth = ((cosAngle + 1) / 2) * 100;
        }

        // Arc between arrows
        const arcRadius = 40;
        const startAngle = Math.min(angleA, angleB);
        const endAngle = Math.max(angleA, angleB);
        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;
        const arcStartX = cx + Math.cos(startRad) * arcRadius;
        const arcStartY = cy - Math.sin(startRad) * arcRadius;
        const arcEndX = cx + Math.cos(endRad) * arcRadius;
        const arcEndY = cy - Math.sin(endRad) * arcRadius;
        const sweep = (endAngle - startAngle) > 180 ? 1 : 0;

        group.innerHTML = `
            <!-- Reference circle -->
            <circle cx="${cx}" cy="${cy}" r="${arrowLen + 20}" fill="none" stroke="#8B949E" stroke-width="1" stroke-dasharray="4" opacity="0.3"/>

            <!-- Angle arc -->
            <path d="M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${sweep} 0 ${arcEndX} ${arcEndY}"
                  fill="none" stroke="#F59E0B" stroke-width="2"/>

            <!-- Angle label -->
            <text x="${cx + Math.cos((startRad + endRad) / 2) * (arcRadius + 18)}"
                  y="${cy - Math.sin((startRad + endRad) / 2) * (arcRadius + 18)}"
                  fill="#F59E0B" font-size="14" text-anchor="middle" font-weight="bold">${Math.round(diff)}°</text>

            <!-- Center -->
            <circle cx="${cx}" cy="${cy}" r="6" fill="#1e293b" stroke="#8B949E" stroke-width="2"/>

            <!-- Arrow A -->
            <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}"
                  stroke="#58A6FF" stroke-width="5" marker-end="url(#compare-arrow-a)"/>
            <circle cx="${ax}" cy="${ay}" r="12" fill="#58A6FF" opacity="0.3" style="cursor: grab;" class="handle" data-arrow="a"/>
            <text x="${ax + 18}" y="${ay}" fill="#58A6FF" font-size="16" font-weight="bold">A</text>

            <!-- Arrow B -->
            <line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}"
                  stroke="#F78166" stroke-width="5" marker-end="url(#compare-arrow-b)"/>
            <circle cx="${bx}" cy="${by}" r="12" fill="#F78166" opacity="0.3" style="cursor: grab;" class="handle" data-arrow="b"/>
            <text x="${bx + 18}" y="${by}" fill="#F78166" font-size="16" font-weight="bold">B</text>
        `;

        // Relationship display
        display.innerHTML = `
            <div class="relationship-bar">
                <div class="relationship-fill" style="width: ${fillWidth}%; background: linear-gradient(90deg, #F78166, #8B949E 50%, #7EE787);"></div>
            </div>
            <div class="relationship-label" style="background: ${bgColor}; color: ${textColor};">${relationship}</div>
        `;

        // Drag handlers
        group.querySelectorAll('.handle').forEach(el => {
            el.addEventListener('mousedown', () => dragging = el.dataset.arrow);
        });
    }

    svg.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const rect = svg.getBoundingClientRect();
        const mx = e.clientX - rect.left - cx;
        const my = -(e.clientY - rect.top - cy);
        const newAngle = (Math.atan2(my, mx) * 180 / Math.PI + 360) % 360;

        if (dragging === 'a') angleA = newAngle;
        else if (dragging === 'b') angleB = newAngle;
        render();
    });

    document.addEventListener('mouseup', () => dragging = null);

    // Preset buttons
    container.querySelectorAll('.preset-button').forEach(btn => {
        btn.addEventListener('click', () => {
            angleA = parseFloat(btn.dataset.a);
            angleB = parseFloat(btn.dataset.b);
            render();
        });
    });

    render();
}

// ============================================
// MAGNITUDE SLIDER INTERACTIVE
// ============================================
function initMagnitudeSlider() {
    const container = document.getElementById('magnitude-slider');
    if (!container) return;

    const width = 600;
    const height = 250;

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <defs>
                <marker id="mag-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#58A6FF"/>
                </marker>
            </defs>
            <g id="magnitude-group"></g>
        </svg>
        <div style="text-align: center;">
            <input type="range" id="mag-slider" min="0.2" max="1" step="0.01" value="0.6" style="width: 280px;">
            <div class="interactive-label" style="margin-top: 0.5rem;">Adjust magnitude — same direction, different intensity</div>
        </div>
    `;

    const group = document.getElementById('magnitude-group');
    const slider = document.getElementById('mag-slider');

    function render() {
        const mag = parseFloat(slider.value);
        const panelWidth = 180;
        const panelGap = 20;

        // Three panels
        const panels = [
            { title: 'DIRECTION ONLY', cx: 100, example: 'compass', hasDir: true, hasMag: false },
            { title: 'MAGNITUDE ONLY', cx: 300, example: 'temperature', hasDir: false, hasMag: true },
            { title: 'BOTH (VECTOR)', cx: 500, example: 'force', hasDir: true, hasMag: true }
        ];

        let content = '';

        panels.forEach(p => {
            // Panel box
            content += `
                <rect x="${p.cx - 85}" y="20" width="170" height="180"
                      fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" rx="8"/>
                <text x="${p.cx}" y="45" text-anchor="middle" fill="#8B949E" font-size="11" font-weight="bold">${p.title}</text>
            `;

            const cy = 120;

            if (p.hasDir && p.hasMag) {
                // Vector arrow with magnitude
                const len = 60 * mag;
                content += `
                    <circle cx="${p.cx - 30}" cy="${cy}" r="5" fill="#1e293b" stroke="#58A6FF" stroke-width="2"/>
                    <line x1="${p.cx - 30}" y1="${cy}" x2="${p.cx - 30 + len}" y2="${cy}"
                          stroke="#58A6FF" stroke-width="${4 + mag * 3}" marker-end="url(#mag-arrow)"/>
                    <text x="${p.cx}" y="${cy + 40}" text-anchor="middle" fill="#58A6FF" font-size="12">${(mag * 100).toFixed(0)}% force</text>
                `;
            } else if (p.hasDir && !p.hasMag) {
                // Direction only (compass)
                content += `
                    <circle cx="${p.cx}" cy="${cy}" r="35" fill="none" stroke="#8B949E" stroke-width="1"/>
                    <line x1="${p.cx}" y1="${cy}" x2="${p.cx}" y2="${cy - 30}"
                          stroke="#58A6FF" stroke-width="3" marker-end="url(#mag-arrow)"/>
                    <text x="${p.cx}" y="${cy - 40}" text-anchor="middle" fill="#58A6FF" font-size="10">N</text>
                    <text x="${p.cx}" y="${cy + 55}" text-anchor="middle" fill="#8B949E" font-size="11">"which way"</text>
                `;
            } else if (!p.hasDir && p.hasMag) {
                // Magnitude only (temperature)
                const barHeight = 50 * mag;
                content += `
                    <rect x="${p.cx - 12}" y="${cy - 30}" width="24" height="60" fill="none" stroke="#8B949E" stroke-width="1" rx="4"/>
                    <rect x="${p.cx - 10}" y="${cy + 28 - barHeight}" width="20" height="${barHeight}"
                          fill="linear-gradient(#F78166, #58A6FF)" rx="2"/>
                    <text x="${p.cx}" y="${cy - 40}" text-anchor="middle" fill="#F78166" font-size="14">${(mag * 100).toFixed(0)}°</text>
                    <text x="${p.cx}" y="${cy + 55}" text-anchor="middle" fill="#8B949E" font-size="11">"how much"</text>
                `;
            }
        });

        group.innerHTML = content;
    }

    slider.addEventListener('input', render);
    render();
}

// ============================================
// GRADIENT LANDSCAPE INTERACTIVE
// ============================================
function initGradientLandscape() {
    const container = document.getElementById('gradient-landscape');
    if (!container) return;

    const width = 550;
    const height = 350;
    const gridSize = 10;
    let clickX = width / 2;
    let clickY = height / 2;
    let balls = [];

    container.innerHTML = `
        <canvas id="gradient-canvas" width="${width}" height="${height}" style="cursor: crosshair; border-radius: 8px;"></canvas>
        <div style="text-align: center; margin-top: 0.75rem;">
            <button id="drop-ball" class="interactive-button">Drop a ball</button>
            <button id="clear-balls" class="interactive-button">Clear</button>
        </div>
        <div class="interactive-instruction">Click anywhere to see the gradient direction (steepest uphill)</div>
    `;

    const canvas = document.getElementById('gradient-canvas');
    const ctx = canvas.getContext('2d');
    const dropBtn = document.getElementById('drop-ball');
    const clearBtn = document.getElementById('clear-balls');

    // Height function (smooth hills)
    function height(x, y) {
        const cx1 = width * 0.3, cy1 = height * 0.35;
        const cx2 = width * 0.7, cy2 = height * 0.6;

        const d1 = Math.sqrt((x - cx1) ** 2 + (y - cy1) ** 2);
        const d2 = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);

        return Math.exp(-d1 * d1 / 12000) * 0.9 + Math.exp(-d2 * d2 / 18000) * 0.7;
    }

    // Gradient (numerical)
    function gradient(x, y) {
        const eps = 2;
        const dhdx = (height(x + eps, y) - height(x - eps, y)) / (2 * eps);
        const dhdy = (height(x, y + eps) - height(x, y - eps)) / (2 * eps);
        return { dx: dhdx, dy: dhdy };
    }

    // Color for height
    function heightColor(h) {
        // Blue → cyan → green → yellow → red
        const r = Math.floor(255 * Math.min(1, h * 2));
        const g = Math.floor(255 * (h < 0.5 ? h * 2 : 2 - h * 2));
        const b = Math.floor(255 * Math.max(0, 1 - h * 2));
        return `rgb(${r},${g},${b})`;
    }

    function render() {
        // Draw height map
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                const h = height(x + gridSize / 2, y + gridSize / 2);
                ctx.fillStyle = heightColor(h);
                ctx.globalAlpha = 0.8;
                ctx.fillRect(x, y, gridSize, gridSize);
            }
        }
        ctx.globalAlpha = 1;

        // Draw click point and gradient
        const g = gradient(clickX, clickY);
        const mag = Math.sqrt(g.dx * g.dx + g.dy * g.dy);
        const arrowLen = Math.min(50, mag * 2500);

        if (mag > 0.0001) {
            const gx = (g.dx / mag) * arrowLen;
            const gy = (g.dy / mag) * arrowLen;

            // Arrow (uphill)
            ctx.beginPath();
            ctx.moveTo(clickX, clickY);
            ctx.lineTo(clickX + gx, clickY + gy);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(gy, gx);
            ctx.beginPath();
            ctx.moveTo(clickX + gx, clickY + gy);
            ctx.lineTo(clickX + gx - 12 * Math.cos(angle - 0.4), clickY + gy - 12 * Math.sin(angle - 0.4));
            ctx.lineTo(clickX + gx - 12 * Math.cos(angle + 0.4), clickY + gy - 12 * Math.sin(angle + 0.4));
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();

            // Label
            ctx.fillStyle = 'white';
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText('uphill', clickX + gx + 10, clickY + gy);
        }

        // Click point
        ctx.beginPath();
        ctx.arc(clickX, clickY, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(clickX, clickY, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw balls
        balls.forEach(ball => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#7EE787';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Trail
            if (ball.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(ball.trail[0].x, ball.trail[0].y);
                ball.trail.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.strokeStyle = 'rgba(126, 231, 135, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    function updateBalls() {
        balls.forEach(ball => {
            if (ball.stopped) return;

            const g = gradient(ball.x, ball.y);
            // Move down-gradient
            ball.vx = ball.vx * 0.95 - g.dx * 500;
            ball.vy = ball.vy * 0.95 - g.dy * 500;

            ball.x += ball.vx * 0.02;
            ball.y += ball.vy * 0.02;

            // Boundaries
            ball.x = Math.max(10, Math.min(width - 10, ball.x));
            ball.y = Math.max(10, Math.min(height - 10, ball.y));

            // Trail
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 50) ball.trail.shift();

            // Stop if slow
            if (Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1) {
                ball.stopped = true;
            }
        });
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        clickX = e.clientX - rect.left;
        clickY = e.clientY - rect.top;
    });

    dropBtn.addEventListener('click', () => {
        balls.push({
            x: clickX,
            y: clickY,
            vx: 0,
            vy: 0,
            trail: [{ x: clickX, y: clickY }],
            stopped: false
        });
    });

    clearBtn.addEventListener('click', () => {
        balls = [];
    });

    function animate() {
        updateBalls();
        render();
        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// CAUSATION FLOW INTERACTIVE
// ============================================
function initCausationFlow() {
    const container = document.getElementById('causation-flow');
    if (!container) return;

    const width = 600;
    const height = 200;

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <defs>
                <marker id="cause-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#58A6FF"/>
                </marker>
            </defs>
            <g id="causation-group"></g>
        </svg>
        <div style="text-align: center; margin-top: 0.75rem;">
            <button id="cause-physics" class="interactive-button active">Physical Cause</button>
            <button id="cause-chemistry" class="interactive-button">Chemical Mechanism</button>
        </div>
    `;

    const group = document.getElementById('causation-group');
    const physicsBtn = document.getElementById('cause-physics');
    const chemistryBtn = document.getElementById('cause-chemistry');

    const examples = {
        physics: {
            nodes: ['Match struck', 'Friction heat', 'Paper ignites', 'Fire burns'],
            color: '#58A6FF'
        },
        chemistry: {
            nodes: ['Nucleophile', 'Attack', 'Transition State', 'Product'],
            color: '#7EE787'
        }
    };

    let currentExample = 'physics';
    let animationPhase = 0;

    function render() {
        const ex = examples[currentExample];
        const nodeCount = ex.nodes.length;
        const spacing = width / (nodeCount + 1);
        const cy = 100;

        let content = `
            <!-- Time arrow -->
            <line x1="40" y1="30" x2="${width - 40}" y2="30" stroke="#8B949E" stroke-width="1"/>
            <polygon points="${width - 40},30 ${width - 50},25 ${width - 50},35" fill="#8B949E"/>
            <text x="${width / 2}" y="20" text-anchor="middle" fill="#8B949E" font-size="11">time →</text>
        `;

        ex.nodes.forEach((node, i) => {
            const x = spacing * (i + 1);
            const isActive = i <= animationPhase;
            const opacity = isActive ? 1 : 0.3;

            // Node box
            content += `
                <rect x="${x - 55}" y="${cy - 20}" width="110" height="40" rx="6"
                      fill="${isActive ? ex.color : '#1e293b'}" opacity="${opacity * 0.9}"
                      stroke="${ex.color}" stroke-width="${isActive ? 2 : 1}"/>
                <text x="${x}" y="${cy + 5}" text-anchor="middle"
                      fill="${isActive ? '#0D1117' : '#8B949E'}" font-size="11" font-weight="500">${node}</text>
            `;

            // Arrow to next
            if (i < nodeCount - 1) {
                const nextX = spacing * (i + 2);
                const arrowActive = i < animationPhase;
                content += `
                    <line x1="${x + 60}" y1="${cy}" x2="${nextX - 65}" y2="${cy}"
                          stroke="${ex.color}" stroke-width="2" opacity="${arrowActive ? 1 : 0.2}"
                          marker-end="url(#cause-arrow)"
                          stroke-dasharray="${arrowActive ? 'none' : '5'}"/>
                `;
            }
        });

        // Caption
        content += `
            <text x="${width / 2}" y="${height - 15}" text-anchor="middle" fill="#8B949E" font-size="11">
                Each step causes the next. The arrow points forward in time.
            </text>
        `;

        group.innerHTML = content;
    }

    function animate() {
        animationPhase++;
        if (animationPhase >= examples[currentExample].nodes.length) {
            animationPhase = 0;
        }
        render();
    }

    physicsBtn.addEventListener('click', () => {
        currentExample = 'physics';
        animationPhase = 0;
        physicsBtn.classList.add('active');
        chemistryBtn.classList.remove('active');
        render();
    });

    chemistryBtn.addEventListener('click', () => {
        currentExample = 'chemistry';
        animationPhase = 0;
        chemistryBtn.classList.add('active');
        physicsBtn.classList.remove('active');
        render();
    });

    render();
    setInterval(animate, 1200);
}

// ============================================
// BRIDGE ANIMATION
// ============================================
function initBridgeAnimation() {
    const container = document.getElementById('bridge-animation');
    if (!container) return;

    const width = 600;
    const height = 250;

    const rows = [
        { perception: '"It points somewhere"', tool: 'Vector' },
        { perception: '"How aligned are they?"', tool: 'Dot Product' },
        { perception: '"What\'s perpendicular?"', tool: 'Cross Product' },
        { perception: '"Which way is steepest?"', tool: 'Gradient' },
        { perception: '"Describe exactly"', tool: 'Components' }
    ];

    container.innerHTML = `
        <svg width="${width}" height="${height}">
            <g id="bridge-group"></g>
        </svg>
    `;

    const group = document.getElementById('bridge-group');
    let visibleRows = 0;

    function render() {
        const rowHeight = height / rows.length;

        let content = `
            <text x="100" y="15" text-anchor="middle" fill="#8B949E" font-size="12" font-weight="bold">PERCEPTION</text>
            <text x="${width - 100}" y="15" text-anchor="middle" fill="#8B949E" font-size="12" font-weight="bold">FORMAL TOOL</text>
        `;

        rows.forEach((row, i) => {
            const y = 40 + i * rowHeight;
            const isVisible = i < visibleRows;

            // Perception (left)
            content += `
                <text x="20" y="${y + 5}" fill="${isVisible ? '#F78166' : '#8B949E'}"
                      font-style="italic" font-size="13" opacity="${isVisible ? 1 : 0.3}">${row.perception}</text>
            `;

            // Arrow
            if (isVisible) {
                content += `
                    <line x1="220" y1="${y}" x2="${width - 180}" y2="${y}"
                          stroke="url(#bridge-gradient-${i})" stroke-width="2"/>
                    <defs>
                        <linearGradient id="bridge-gradient-${i}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#F78166"/>
                            <stop offset="100%" stop-color="#58A6FF"/>
                        </linearGradient>
                    </defs>
                    <polygon points="${width - 175},${y} ${width - 185},${y - 5} ${width - 185},${y + 5}"
                             fill="#58A6FF"/>
                `;
            }

            // Tool (right)
            content += `
                <text x="${width - 20}" y="${y + 5}" text-anchor="end"
                      fill="${isVisible ? '#58A6FF' : '#8B949E'}" font-family="'JetBrains Mono', monospace"
                      font-size="14" font-weight="500" opacity="${isVisible ? 1 : 0.3}">${row.tool}</text>
            `;
        });

        // Final message
        if (visibleRows >= rows.length) {
            content += `
                <text x="${width / 2}" y="${height - 10}" text-anchor="middle"
                      fill="#7EE787" font-size="13" font-weight="bold">THE PERCEPTION CAME FIRST</text>
            `;
        }

        group.innerHTML = content;
    }

    // Observe when in view
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const interval = setInterval(() => {
                visibleRows++;
                render();
                if (visibleRows > rows.length) clearInterval(interval);
            }, 400);
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(container);
    render();
}
