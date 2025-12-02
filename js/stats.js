// Register ScrollTrigger globally once
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Render stats section
function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    
    // Using new realistic data points
    const newStats = {
      "studentsCollaborated": 14,
      "bugsFixed": 950,
      "gitPushes": 4500,
      "hoursSpent": 2100
    };

    if (!statsGrid || !newStats) return;

    // Data structure for rendering
    const stats = [
        { number: newStats.studentsCollaborated, label: 'Students Collaborated', unit: '' },
        { number: newStats.bugsFixed, label: 'Bugs Fixed', unit: '+' },
        { number: newStats.gitPushes, label: 'Git Pushes', unit: '+' },
        { number: newStats.hoursSpent, label: 'Hours Spent', unit: '+' }
    ];

    statsGrid.innerHTML = stats.map((stat, index) => `
        <div class="stat-card stat-card-${index + 1}">
            <span class="stat-number" data-target="${stat.number}" data-unit="${stat.unit}">0</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('');
}

// GSAP animation for stats (Count-Up and Elastic Bounce)
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statCards = document.querySelectorAll('.stat-card');
    
    // Critical check: if no cards are found, stop execution.
    if (statCards.length === 0) {
        console.warn("AnimateStats: No stat cards found. Rendering may have failed.");
        return;
    }
    
    // 1. CRITICAL FIX: Override CSS 'opacity: 0;' and 'visibility: hidden;' immediately.
    // This ensures the element is visible before animation starts.
    gsap.set(statCards, { opacity: 1, visibility: "visible" });

    // 2. Animate the container cards (visual bounce/fade in)
    gsap.from(statCards, 
        {
            y: 50,
            opacity: 0,
            scale: 0.8,
            duration: 1.2,
            stagger: 0.15, 
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: ".stats-section",
                start: "top 80%", 
                toggleActions: "play none none reverse"
            }
        }
    );

    // 3. Animate the count-up for the numbers
    statNumbers.forEach(numberEl => {
        const targetValue = parseInt(numberEl.getAttribute('data-target'));
        const unit = numberEl.getAttribute('data-unit') || '';
        
        // Use a unique ID to prevent double-triggering
        const triggerID = 'countUp-' + targetValue + '-' + Math.random().toString(36).substring(7);
        
        const counter = { value: 0 };

        gsap.to(counter, {
            value: targetValue,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
                id: triggerID,
                trigger: numberEl,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            onUpdate: () => {
                numberEl.textContent = Math.ceil(counter.value).toLocaleString('en-US') + unit;
            },
            onComplete: () => {
                numberEl.textContent = targetValue.toLocaleString('en-US') + unit;
            }
        });
    });
}