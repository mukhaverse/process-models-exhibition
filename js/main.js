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
        
        // Initialize everything in correct order
        initParticles();
        initHeroAnimations();
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
        }, 100);
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}