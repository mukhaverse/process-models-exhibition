// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initAnimations();
    initCarousel();
    initFlipCards();
    initProjectExpansion();
});

// Create floating particles
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particlesContainer.appendChild(particle);

        gsap.to(particle, {
            y: -100 + Math.random() * 200,
            x: -50 + Math.random() * 100,
            opacity: Math.random() * 0.5,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// Initialize all animations
function initAnimations() {
    // Hero animations
    gsap.from('.hero-label', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.hero-title span', {
        duration: 1.2,
        y: 80,
        opacity: 0,
        stagger: 0.2,
        delay: 0.3,
        ease: 'power4.out'
    });

    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.hero-meta span', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power3.out'
    });

    // Floating shapes animation
    gsap.to('.shape-circle', {
        y: -40,
        x: 30,
        rotation: 360,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-square', {
        rotation: 405,
        y: 30,
        x: -20,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-triangle', {
        y: 40,
        x: -30,
        rotation: -180,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-hexagon', {
        y: -30,
        x: 40,
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // Corner UI fade in
    gsap.from('.corner-ui', {
        duration: 1,
        opacity: 0,
        delay: 1.5,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Projects animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 80%'
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%'
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
                start: 'top 85%'
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Stats animation with width expansion
    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: '.stats-section',
                start: 'top 80%',
                onEnter: () => {
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, index * 100);
                }
            },
            duration: 0.6,
            ease: 'back.out(1.2)'
        });
    });

    // Insights animation
    gsap.from('.insight-card', {
        scrollTrigger: {
            trigger: '.questionnaire-section',
            start: 'top 80%'
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)'
    });
}

// Projects Carousel functionality
function initCarousel() {
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.project-card');

    if (!track || !prevBtn || !nextBtn || cards.length === 0) {
        console.warn('Carousel elements not found');
        return;
    }

    let currentIndex = 0;

    function getCardWidth() {
        if (cards.length === 0) return 380 + 32;
        const cardStyle = window.getComputedStyle(cards[0]);
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap) || 32;
        return cardWidth + gap;
    }

    function getVisibleCardsCount() {
        const width = window.innerWidth;
        if (width > 1400) return 3;
        if (width > 768) return 2;
        return 1;
    }

    function updateCarousel() {
        const cardWidth = getCardWidth();
        const offset = -currentIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        const cardsVisible = getVisibleCardsCount();
        const maxIndex = Math.max(0, cards.length - cardsVisible);
        
        prevBtn.classList.toggle('disabled', currentIndex === 0);
        nextBtn.classList.toggle('disabled', currentIndex >= maxIndex);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const cardsVisible = getVisibleCardsCount();
        const maxIndex = Math.max(0, cards.length - cardsVisible);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Initialize carousel on load and resize
    window.addEventListener('load', updateCarousel);
    window.addEventListener('resize', updateCarousel);
    
    // Initial update
    setTimeout(updateCarousel, 100);
}

// Insight cards flip functionality
function initFlipCards() {
    document.querySelectorAll('.insight-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

// Project Card Expansion functionality
function initProjectExpansion() {
    const overlay = document.getElementById('projectOverlay');
    const projectCards = document.querySelectorAll('.project-card');
    const body = document.body;

    if (!overlay) {
        console.warn('Project overlay not found');
        return;
    }

    projectCards.forEach(card => {
        const expandBtn = card.querySelector('.project-expand-btn');
        const closeBtn = card.querySelector('.project-close');

        if (!expandBtn || !closeBtn) {
            console.warn('Project card buttons not found');
            return;
        }

        // Expand card
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.add('expanded');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        });

        // Close card
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.remove('expanded');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close on overlay click
    overlay.addEventListener('click', () => {
        projectCards.forEach(card => card.classList.remove('expanded'));
        overlay.classList.remove('active');
        body.style.overflow = '';
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            projectCards.forEach(card => card.classList.remove('expanded'));
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Handle page load and ensure everything is visible
window.addEventListener('load', function() {
    // Force carousel to be visible
    const track = document.getElementById('projectsTrack');
    if (track) {
        track.style.transform = 'translateX(0)';
    }
    
    // Ensure all project cards are visible
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
    });
});