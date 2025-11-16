// Render stats section
function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid || !appData.stats) return;

    const stats = [
        { number: appData.stats.linesOfCode, label: 'Lines Written' },
        { number: appData.stats.bugsFixed, label: 'Bugs Fixed' },
        { number: appData.stats.gitPushes, label: 'Git Pushes' },
        { number: appData.stats.coffeeRuns, label: 'Coffee Runs' }
    ];

    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <span class="stat-number">${stat.number}</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('');
}

// GSAP animation for stats - width grows from left to right
function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length === 0) {
        console.warn('No stat cards found for animation');
        return;
    }
    
    // Set initial state IMMEDIATELY after cards are in DOM
    gsap.set(statCards, {
        scaleX: 0,
        transformOrigin: "left center",
        opacity: 1
    });

    // Animate each card with stagger
    gsap.to(statCards, {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".stats-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none"
        }
    });
}