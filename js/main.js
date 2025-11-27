// Global data store
let appData = {};
let galleryData = {};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        
        // Load gallery data separately
        const galleryResponse = await fetch('gallery.json');
        galleryData = await galleryResponse.json();
        
        console.log('Gallery data loaded:', galleryData);
        
        // Initialize everything in correct order
        initParticles();
        initHeroAnimations();
        renderStats();
        renderProjects();
        renderInsights();
        // renderTestimonials(); // Comment this out if function doesn't exist
        
        // Update counts in hero section
        document.getElementById('teamsCount').textContent = `${new Set(appData.projects.map(p => p.team)).size} TEAMS`;
        document.getElementById('projectsCount').textContent = `${appData.projects.length} PROJECTS`;
        
        // Initialize interactive components after rendering
        setTimeout(() => {
            initCarousel();
            initFlipCards();
            initProjectExpansion();
            initScrollAnimations();
            
            // Render and initialize gallery
            console.log('About to render gallery');
            renderGallery();
            initGalleryScroll();
        }, 100);
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}