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
                <img src="placeholder.png" alt="${project.name}" class="project-placeholder">
            </div>
            <div class="project-content">
                <h3 class="project-name">${project.name}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-expand-container">
                    <button class="project-expand-btn" data-project-id="${project.id}">
                        <img src="exp.png" alt="Expand" class="expand-icon white">
                    </button>
                </div>
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
    const cardWidth = 380; // Fixed width for all cards
    const gap = 32;

    function getVisibleCardsCount() {
        const container = track.parentElement;
        const containerWidth = container.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        const visible = Math.floor(containerWidth / totalCardWidth);
        return Math.max(1, visible);
    }

    function updateCarousel() {
        const totalCardWidth = cardWidth + gap;
        const offset = -currentIndex * totalCardWidth;
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

    // Add right padding to show last card completely
    track.style.paddingRight = `${cardWidth + gap}px`;

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
                <img src="placeholder.png" alt="${project.name}" class="project-placeholder">
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

            <!-- Action Buttons -->
            <div class="project-actions">
                ${project.demoUrl ? `
                    <a href="${project.demoUrl}" class="btn btn-primary" target="_blank" rel="noopener">
                        <span>🚀 Live Demo</span>
                    </a>
                ` : ''}
                ${project.githubUrl ? `
                    <a href="${project.githubUrl}" class="btn btn-outline" target="_blank" rel="noopener">
                        <span>💻 GitHub</span>
                    </a>
                ` : ''}
            </div>
            
            <!-- Team Members -->
            ${project.teamMembers && project.teamMembers.length > 0 ? `
                <div class="team-members-section">
                    <h4>Team Members</h4>
                    <div class="team-members-list">
                        ${project.teamMembers.map(member => `
                            <a href="${member.linkedin}" class="team-member-link" target="_blank" rel="noopener">
                                <span class="member-name">${member.name}</span>
                                <svg class="linkedin-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

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

    document.addEventListener('click', function(e) {
        const button = e.target.closest('.project-expand-btn');
        if (button) {
            const projectId = parseInt(button.getAttribute('data-project-id'));
            openBottomSheet(projectId);
        }
    });

    bottomSheetClose.addEventListener('click', closeBottomSheet);
    overlay.addEventListener('click', closeBottomSheet);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bottomSheet.classList.contains('active')) {
            closeBottomSheet();
        }
    });
}