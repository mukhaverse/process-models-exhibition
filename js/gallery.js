// Render gallery photos
function renderGallery() {
    const container = document.getElementById('galleryPhotos');
    if (!container || !galleryData.gallery) return; 
    
    galleryData.gallery.forEach((photo) => { 
        const photoDiv = document.createElement('div');
        photoDiv.className = 'gallery-photo';
        photoDiv.style.transform = `translateY(${photo.offset}px)`;
        
        photoDiv.innerHTML = `
            <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
            
        `;
        
        container.appendChild(photoDiv);
    });
}


function initGalleryScroll() {
    const container = document.querySelector('.gallery-photos');
    if (!container) return;
    
    const totalWidth = container.scrollWidth - window.innerWidth;
    
    gsap.to('.gallery-photos', {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery-scroll-container',
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true
        }
    });
    
    
    gsap.to('.gallery-photo', {
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none'
        }
    });
}