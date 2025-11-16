// Global data store
let appData = {};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        
        // Initialize static animations first
        initParticles();
        initStaticAnimations();
        
        // Then render dynamic content
        renderStats();
        renderProjects();
        renderInsights();
        renderTestimonials();
        
        // Update counts in hero section
        document.getElementById('teamsCount').textContent = `${new Set(appData.projects.map(p => p.team)).size} TEAMS`;
        document.getElementById('projectsCount').textContent = `${appData.projects.length} PROJECTS`;
        
        // Initialize interactive components after rendering
        setTimeout(() => {
            initCarousel();
            initFlipCards();
            initProjectExpansion();
            initScrollAnimations();
        }, 200);
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

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

// Initialize static animations (hero, shapes, etc.)
function initStaticAnimations() {
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
}

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

    // Stats animation with width expansion
    animateStats();

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

// Render projects section
function renderProjects() {
    const projectsTrack = document.getElementById('projectsTrack');
    if (!projectsTrack || !appData.projects) return;

    projectsTrack.innerHTML = appData.projects.map(project => `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-image">
                <div class="project-number">${project.number}</div>
                ${project.emoji}
            </div>
            <div class="project-content">
                <h3 class="project-name">${project.name}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="btn btn-outline project-expand-btn" data-project-id="${project.id}">
                    <span>Explore</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Render insights flip cards
function renderInsights() {
    const insightsGrid = document.getElementById('insightsGrid');
    if (!insightsGrid || !appData.insights) return;

    insightsGrid.innerHTML = appData.insights.map(insight => `
        <div class="insight-card" data-insight-id="${insight.id}">
            <div class="insight-card-inner">
                <div class="insight-card-front">
                    <div>
                        <div class="insight-number">${insight.number}</div>
                        <div class="insight-question">${insight.question}</div>
                        <div class="insight-prompt">${insight.prompt}</div>
                    </div>
                    <div class="click-hint">Click to Flip</div>
                </div>
                <div class="insight-card-back">
                    <div>
                        <div class="insight-number">${insight.number}</div>
                        <div class="insight-question">${insight.question}</div>
                        <div class="insight-answer">${insight.answer}</div>
                        <div class="insight-context">${insight.context}</div>
                    </div>
                    <div class="click-hint">Click to Flip Back</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render testimonials
function renderTestimonials() {
    const feedbackCarousel = document.getElementById('feedbackCarousel');
    if (!feedbackCarousel || !appData.testimonials) return;

    // Duplicate testimonials for seamless scrolling
    const duplicatedTestimonials = [...appData.testimonials, ...appData.testimonials];
    
    feedbackCarousel.innerHTML = duplicatedTestimonials.map(testimonial => `
        <div class="feedback-card">
            <p class="feedback-text">"${testimonial.text}"</p>
            <p class="feedback-author">— ${testimonial.author}</p>
        </div>
    `).join('');
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
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // Fixed gap value
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

    // Initialize carousel
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
}

// Insight cards flip functionality
function initFlipCards() {
    const insightCards = document.querySelectorAll('.insight-card');
    if (insightCards.length === 0) {
        console.warn('No insight cards found');
        return;
    }
    
    insightCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

// Project Bottom Sheet functionality
function initProjectExpansion() {
    const overlay = document.getElementById('projectOverlay');
    const bottomSheet = document.getElementById('projectBottomSheet');
    const bottomSheetContent = document.getElementById('bottomSheetContent');
    const bottomSheetClose = document.getElementById('bottomSheetClose');
    const body = document.body;

    if (!overlay || !bottomSheet || !bottomSheetContent) {
        console.warn('Bottom sheet elements not found');
        return;
    }

    // Open bottom sheet
    function openBottomSheet(projectId) {
        const project = appData.projects.find(p => p.id === projectId);
        if (!project) return;

        const content = `
            <div class="bottom-sheet-project-image">
                <div class="bottom-sheet-project-number">${project.number}</div>
                ${project.emoji}
            </div>
            
            <div class="project-content">
                <h3 class="project-name">${project.name}</h3>
                <div class="project-meta">
                    <span class="project-team">${project.team}</span>
                    <span class="project-sprints">${project.sprints} Sprints</span>
                    <span class="project-status">${project.status}</span>
                </div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p class="project-description">${project.description}</p>
            </div>

            <div class="expanded-section">
                <h4>About the Project</h4>
                ${project.about.map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>

            <div class="expanded-section">
                <h4>Key Features</h4>
                <ul class="feature-list">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div class="expanded-section">
                <h4>Technology Stack</h4>
                <div class="tech-stack">
                    ${project.techStack.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        bottomSheetContent.innerHTML = content;
        overlay.classList.add('active');
        bottomSheet.classList.add('active');
        body.style.overflow = 'hidden';
    }

    // Close bottom sheet
    function closeBottomSheet() {
        overlay.classList.remove('active');
        bottomSheet.classList.remove('active');
        body.style.overflow = '';
        
        setTimeout(() => {
            bottomSheetContent.scrollTop = 0;
        }, 400);
    }

    // Add click events to project cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('.project-expand-btn')) {
            const button = e.target.closest('.project-expand-btn');
            const projectId = parseInt(button.getAttribute('data-project-id'));
            openBottomSheet(projectId);
        }
    });

    // Close events
    bottomSheetClose.addEventListener('click', closeBottomSheet);
    overlay.addEventListener('click', closeBottomSheet);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bottomSheet.classList.contains('active')) {
            closeBottomSheet();
        }
    });
}