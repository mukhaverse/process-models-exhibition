// Initialize scroll-triggered animations
function initScrollAnimations() {
    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Section label animations
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            scrollTrigger: {
                trigger: label,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Stats animation with width expansion
    animateStats();

    // Projects animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Insights animation
    gsap.from('.insight-card', {
        scrollTrigger: {
            trigger: '.questionnaire-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)'
    });

    // Feedback cards animation
    gsap.from('.feedback-card', {
        scrollTrigger: {
            trigger: '.feedback-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// GSAP animation for stats - width grows from left to right
function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    if (statCards.length === 0) return;
    
    // Set initial state - hidden with scaleX 0
    gsap.set(statCards, {
        scaleX: 0,
        transformOrigin: "left center"
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