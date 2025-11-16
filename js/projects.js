// Render projects section
function renderProjects() {
    const projectsTrack = document.getElementById('projectsTrack');
    
    if (!projectsTrack) {
        console.error('Projects track element not found');
        return;
    }

    if (!appData.projects || appData.projects.length === 0) {
        console.warn('No projects data available');
        projectsTrack.innerHTML = '<div class="no-projects">No projects to display</div>';
        return;
    }

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
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const gap = 32; // Make sure this matches your CSS gap
        return cardWidth + gap;
    }

    function getVisibleCardsCount() {
        const container = track.parentElement;
        const containerWidth = container.offsetWidth;
        const cardWidth = getCardWidth();
        const visible = Math.floor(containerWidth / cardWidth);
        return Math.max(1, visible);
    }

    function updateCarousel() {
        const cardWidth = getCardWidth();
        const offset = -currentIndex * cardWidth;
        track.style.transform = `translateX(${offset}px)`;
        
        const visibleCards = getVisibleCardsCount();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        
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
        const visibleCards = getVisibleCardsCount();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Initialize
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
}

// Project Bottom Sheet functionality
function initProjectExpansion() {
    const overlay = document.getElementById('projectOverlay');
    const bottomSheet = document.getElementById('projectBottomSheet');
    const bottomSheetContent = document.getElementById('bottomSheetContent');
    const bottomSheetClose = document.getElementById('bottomSheetClose');

    if (!overlay || !bottomSheet || !bottomSheetContent || !bottomSheetClose) {
        console.warn('Bottom sheet elements not found');
        return;
    }

    function openBottomSheet(projectId) {
        const project = appData.projects.find(p => p.id === projectId);
        if (!project) {
            console.warn('Project not found:', projectId);
            return;
        }

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
        document.body.style.overflow = 'hidden';
    }

    function closeBottomSheet() {
        overlay.classList.remove('active');
        bottomSheet.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            bottomSheetContent.scrollTop = 0;
        }, 400);
    }

    // Add click events to project cards - using event delegation
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.project-expand-btn');
        if (button) {
            const projectId = parseInt(button.getAttribute('data-project-id'));
            openBottomSheet(projectId);
        }
    });

    // Close events
    bottomSheetClose.addEventListener('click', closeBottomSheet);
    overlay.addEventListener('click', closeBottomSheet);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bottomSheet.classList.contains('active')) {
            closeBottomSheet();
        }
    });
}