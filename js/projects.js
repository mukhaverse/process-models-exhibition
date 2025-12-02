// Global data store 'appData' is assumed to be available from main.js

// Render projects section
function renderProjects() {
    const projectsTrack = document.getElementById('projectsTrack');
    
    if (!projectsTrack) return;

    if (!appData.projects || appData.projects.length === 0) {
        projectsTrack.innerHTML = '<div class="no-projects">No projects to display</div>';
        return;
    }

    projectsTrack.innerHTML = appData.projects.map(project => {
        
        const primaryTag = project.tags[0] 
            ? '.' + project.tags[0].toLowerCase().replace(/\s+/g, '_') 
            : '.project_file';

        return `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-image">
                <div class="project-number">${project.number}</div>
                <img src="placeholder.png" alt="${project.name}" class="project-placeholder">
            </div>
            <div class="project-content">
                <div class="project-type">${primaryTag}</div>
                <h3 class="project-name">${project.name}</h3>
                <p class="project-short-desc">${project.description}</p>
                
                <div class="project-expand-container">
                    <button class="project-expand-btn" data-project-id="${project.id}">
                        <img src="exp.png" alt="Expand" class="expand-icon white">
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Projects Carousel functionality
function initCarousel() {
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.project-card'); 

    if (!track || !prevBtn || !nextBtn || cards.length === 0) {
        return;
    }

    let currentIndex = 0;
    const cardWidth = 380; 
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

    
    track.style.paddingRight = `${cardWidth + gap}px`;

    updateCarousel();
    window.addEventListener('resize', updateCarousel);
}



function initProjectExpansion() {
    const overlay = document.getElementById('projectOverlay');
    const bottomSheet = document.getElementById('projectBottomSheet');
    const bottomSheetContent = document.getElementById('bottomSheetContent');
    const bottomSheetClose = document.getElementById('bottomSheetClose');

    if (!overlay || !bottomSheet || !bottomSheetContent || !bottomSheetClose) {
        console.warn('Bottom sheet elements not found');
        return;
    }

    
    function closeBottomSheet() {
        overlay.classList.remove('active');
        bottomSheet.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            bottomSheetContent.scrollTop = 0;
        }, 400);
    }

   
    function openBottomSheet(projectId) {
        const project = appData.projects.find(p => p.id === projectId);
        if (!project) return;

        // Conditional Rendering: Show "VIEW WEBSITE" button ONLY when platform is 'Website'
       
        const demoButton = (project.platform === 'Website' && project.demoUrl)
            ? `<a href="${project.demoUrl}" class="btn btn-outline" target="_blank">🌐 VIEW WEBSITE</a>`
            : '';
            
        
        const githubButton = project.githubUrl
            ? `<a href="${project.githubUrl}" class="btn " target="_blank">🗄️ GITHUB REPOSITORY</a>`
            : '';


       
        const content = `
            <div class="sheet-hero">
                <img src="placeholder.png" alt="${project.name}">
                <div class="sheet-hero-overlay">
                    </div>
            </div>

            <div class="sheet-grid">
                
                <div class="sheet-main">
                    <h3 class="sheet-title">${project.name}</h3>
                    
                    <div class="sheet-section">
                        <div class="sheet-section-title">Project Overview</div>
                        <p class="project-description">${project.description}</p>
                        <div style="margin-top: 1rem; line-height: 1.8; opacity: 0.8;">
                            ${project.about.map(p => `<p style="margin-bottom:1rem">${p}</p>`).join('')}
                        </div>
                    </div>

                    <div class="sheet-section">
                        <div class="sheet-section-title">Key Features</div>
                        <ul class="feature-list">
                            ${project.features ? project.features.map(f => `<li>${f}</li>`).join('') : ''}
                        </ul>
                    </div>

                    <div class="project-actions">
                        ${demoButton}
                        ${githubButton}
                    </div>
                </div>

                <div class="sheet-sidebar">
                    <div class="meta-item">
                        <span class="meta-label">SCRUM MASTER</span>
                        <div class="meta-value">${project.scrumMaster || 'N/A'}</div>
                    </div>
                    
                    <div class="meta-item">
                        <span class="meta-label">PLATFORM</span>
                        <div class="meta-value">${project.platform || 'N/A'}</div>
                    </div>

                    <div class="meta-item">
                        <span class="meta-label">SPRINTS</span>
                        <div class="meta-value">${project.sprints} Sprints</div>
                    </div>

                    <div class="meta-item">
                        <span class="meta-label">Tech Stack</span>
                        <div class="tech-stack" style="margin-top: 0.5rem">
                            ${project.techStack.map(tech => 
                                `<span class="tag" style="font-size: 0.7rem">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div class="meta-item">
                        <span class="meta-label">Developers</span>
                        <div class="team-members-list" style="margin-top: 0.5rem">
                            ${project.teamMembers.map(member => `
                                <a href="${member.linkedin}" class="team-member-link" target="_blank">
                                    <span class="member-name">${member.name}</span>
                                    <i class='bx bxl-linkedin-square'></i>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>

            </div>
        `;

        bottomSheetContent.innerHTML = content;
        overlay.classList.add('active');
        bottomSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
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