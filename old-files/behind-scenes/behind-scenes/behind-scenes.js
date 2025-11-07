// Behind the Scenes - Polaroid Photo Gallery with GSAP
window.addEventListener('DOMContentLoaded', function() {

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded for behind-the-scenes.');
    return;
  }

  const scatterBtn = document.getElementById('scatterBtn');
  const photos = document.querySelectorAll('.photo');
  const photoArea = document.querySelector('.photo-area');
  const scat = this.document.querySelector('.scat-b')

  if (!scatterBtn || photos.length === 0) {
    console.warn('Behind the scenes elements not found');
    return;
  }

  let isScattered = false;

  // Define exact positions for each photo (grid layout)
  // Desktop layout: 5 photos in a row with slight organic spacing
  const desktopPositions = [
    { x: -360, y: -20, rotation: -2 },   // Photo 1
    { x: -180, y: 10, rotation: 1 },     // Photo 2
    { x: 0, y: -10, rotation: -1 },      // Photo 3
    { x: 180, y: 15, rotation: 2 },      // Photo 4
    { x: 360, y: -15, rotation: -1 }     // Photo 5
  ];

  // Tablet layout: 3 top, 2 bottom
  const tabletPositions = [
    { x: -150, y: -90, rotation: -1 },   // Photo 1
    { x: 0, y: -85, rotation: 1 },       // Photo 2
    { x: 150, y: -95, rotation: -2 },    // Photo 3
    { x: -75, y: 90, rotation: 2 },      // Photo 4
    { x: 75, y: 85, rotation: -1 }       // Photo 5
  ];

  // Mobile layout: 2-2-1
  const mobilePositions = [
    { x: -55, y: -170, rotation: -1 },   // Photo 1
    { x: 55, y: -170, rotation: 2 },     // Photo 2
    { x: -55, y: 0, rotation: -2 },      // Photo 3
    { x: 55, y: 0, rotation: 1 },        // Photo 4
    { x: 0, y: 170, rotation: -1 }       // Photo 5
  ];

  // Get current positions based on screen size
  function getCurrentPositions() {
    const width = window.innerWidth;
    if (width <= 480) return mobilePositions;
    if (width <= 768) return tabletPositions;
    return desktopPositions;
  }

  // Initialize photos - all in center, hidden
  photos.forEach((photo, index) => {
    // Add inner div for the photo content
    if (!photo.querySelector('.photo-inner')) {
      const inner = document.createElement('div');
      inner.className = 'photo-inner';
      photo.appendChild(inner);
    }

    // Set initial state
    gsap.set(photo, {
      x: 0,
      y: 0,
      rotation: 0,
      // opacity: 0,
      scale: 1
    });
  });

  // Scatter animation
  function scatterPhotos() {
    const positions = getCurrentPositions();
    
    // Hide button
    // gsap.to(scatterBtn, {
    //   opacity: 0,
    //   scale: 0.8,
    //   duration: 0.3,
    //   ease: "power2.in",
    //   onComplete: () => {
    //     scatterBtn.style.pointerEvents = 'none';
    //   }
    // });

    // Animate each photo to its position
    photos.forEach((photo, index) => {
      gsap.to(photo, {
        x: positions[index].x,
        y: positions[index].y,
        rotation: positions[index].rotation,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "back.out(1.2)",
        onStart: () => {
          photo.classList.add('scattered');
        }
      });
    });

    // Show gather button after animation
    gsap.to(scatterBtn, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      delay: photos.length * 0.1 + 0.8,
      ease: "power2.out",
      onStart: () => {
        scatterBtn.textContent = 'Gather Back';
        scatterBtn.style.pointerEvents = 'all';
      }
    });
  }

  // Gather animation
  function gatherPhotos() {
    // Hide button
    gsap.to(scatterBtn, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        scatterBtn.style.pointerEvents = 'none';
      }
    });

    // Animate each photo back to center
    photos.forEach((photo, index) => {
      gsap.to(photo, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 0,
        duration: 0.6,
        delay: (photos.length - index - 1) * 0.08,
        ease: "power2.in",
        onComplete: () => {
          if (index === 0) {
            photo.classList.remove('scattered');
          }
        }
      });
    });

    // Show scatter button after animation
    gsap.to(scatterBtn, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      delay: photos.length * 0.08 + 0.6,
      ease: "power2.out",
      onStart: () => {
        scatterBtn.textContent = 'See the Moments';
        scatterBtn.style.pointerEvents = 'all';
      }
    });
  }

  // Button click handler
  scatterBtn.addEventListener('click', () => {
    if (!isScattered) {
      scatterPhotos();
      isScattered = true;
    } else {
      gatherPhotos();
      isScattered = false;
    }
  });

  // Hover effect for individual photos
  photos.forEach((photo) => {
    photo.addEventListener('mouseenter', function() {
      if (isScattered) {
        gsap.to(this, {
          scale: 1.08,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    photo.addEventListener('mouseleave', function() {
      if (isScattered) {
        gsap.to(this, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });

  // Handle window resize - reposition photos if scattered
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isScattered) {
        const positions = getCurrentPositions();
        photos.forEach((photo, index) => {
          gsap.to(photo, {
            x: positions[index].x,
            y: positions[index].y,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      }
    }, 200);
  });

  // Optional: Keyboard shortcut (Space bar) to toggle
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      const rect = photoArea.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        e.preventDefault();
        scatterBtn.click();
      }
    }
  });

});

  scatterBtn.addEventListener('click', () => {
    if (!isScattered) {
      scatterPhotos();
      isScattered = true;
    } else {
      gatherPhotos();
      isScattered = false;
    }
  });

  scat.addEventListener('click', () =>{
    gsap.to( '.bts-item', {duration: 2, x:'-50vw', y:'-50vh' , ease: 'bounce'})

  })