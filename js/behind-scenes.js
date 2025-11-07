// Behind the Scenes - Simple Scatter/Gather Animation
window.addEventListener('DOMContentLoaded', function() {

  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded');
    return;
  }

  const scatterBtn = document.querySelector('.sctB');
  const items = document.querySelectorAll('.bts-item');
  const container = document.querySelector('.bts-grid-container');

  if (!scatterBtn || items.length === 0 || !container) {
    console.warn('Behind the scenes elements not found');
    return;
  }

  // Ensure button is always on top
  scatterBtn.style.zIndex = '9999';

  let isScattered = false;

  // Store original grid positions for each item
  const gridPositions = [];
  
  // Calculate and store each item's position in the grid
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    gridPositions.push({
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top
    });
  });

  // Get container center
  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;

  // Get item dimensions for centering (will vary by screen size)
  function getItemDimensions() {
    const width = window.innerWidth;
    if (width >= 1200) return { w: 280, h: 360 }; // 280 width + height calculated
    if (width <= 480) return { w: 140, h: 185 }; 
    if (width <= 768) return { w: 160, h: 210 };
    return { w: 220, h: 280 }; // default
  }

  // Set all items to absolute positioning within container
  items.forEach((item, index) => {
    item.style.position = 'absolute';
    item.style.margin = '0';
    
    const dims = getItemDimensions();
    
    // Start at center with stacked effect
    // Each item slightly offset to create a peek/stack effect
    const offsetX = gsap.utils.random(-12, 12);
    const offsetY = gsap.utils.random(-12, 12);
    const randomRotation = gsap.utils.random(-10, 10);
    
    gsap.set(item, {
      left: centerX - (dims.w / 2) + offsetX,
      top: centerY - (dims.h / 2) + offsetY,
      scale: 0.5,
      opacity: 0.8,
      rotation: randomRotation,
      zIndex: 10 + index // Stack them but keep below button (button is 9999)
    });
  });

  // Scatter animation - move to grid positions
  function scatter() {
    const tl = gsap.timeline();
    
    items.forEach((item, index) => {
      tl.to(item, {
        left: gridPositions[index].x,
        top: gridPositions[index].y,
        scale: 1,
        opacity: 1,
        rotation: gsap.utils.random(-5, 5),
        zIndex: 50 + index, // Higher z-index when scattered
        duration: 0.8,
        ease: "back.out(1.5)",
        onComplete: () => {
          item.style.pointerEvents = 'all'; // Enable clicking when scattered
        }
      }, index * 0.05); // Stagger start times
    });
    
    return tl;
  }

  // Gather animation - move back to center with stack effect
  function gather() {
    const tl = gsap.timeline();
    const dims = getItemDimensions();
    
    items.forEach((item, index) => {
      const offsetX = gsap.utils.random(-12, 12);
      const offsetY = gsap.utils.random(-12, 12);
      const randomRotation = gsap.utils.random(-10, 10);
      
      tl.to(item, {
        left: centerX - (dims.w / 2) + offsetX,
        top: centerY - (dims.h / 2) + offsetY,
        scale: 0.5,
        opacity: 0.8,
        rotation: randomRotation,
        zIndex: 10 + index, // Lower z-index when gathered (below button)
        duration: 0.6,
        ease: "power2.in",
        onStart: () => {
          item.style.pointerEvents = 'none'; // Disable clicking when gathered
        }
      }, index * 0.03); // Stagger start times
    });
    
    return tl;
  }

  // Button click handler
  scatterBtn.addEventListener('click', () => {
    if (!isScattered) {
      scatter();
      scatterBtn.textContent = 'Gather';
      isScattered = true;
    } else {
      gather();
      scatterBtn.textContent = 'Scatter';
      isScattered = false;
    }
  });

  // Recalculate positions on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate grid positions
      items.forEach((item, index) => {
        // Temporarily reset to static to get natural position
        item.style.position = 'static';
        const rect = item.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        gridPositions[index] = {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top
        };
        
        // Set back to absolute
        item.style.position = 'absolute';
      });

      // Recalculate center
      const newContainerRect = container.getBoundingClientRect();
      const newCenterX = newContainerRect.width / 2;
      const newCenterY = newContainerRect.height / 2;

      // Update positions based on current state
      if (isScattered) {
        items.forEach((item, index) => {
          gsap.set(item, {
            left: gridPositions[index].x,
            top: gridPositions[index].y
          });
        });
      } else {
        const dims = getItemDimensions();
        items.forEach((item, index) => {
          const offsetX = gsap.utils.random(-12, 12);
          const offsetY = gsap.utils.random(-12, 12);
          gsap.set(item, {
            left: newCenterX - (dims.w / 2) + offsetX,
            top: newCenterY - (dims.h / 2) + offsetY
          });
        });
      }
    }, 300);
  });


  // if (!scatterBtn || photos.length === 0) {
  //   console.warn('Behind the scenes elements not found');
  //   return;
  // }

  // let isScattered = false;

  // // Define exact positions for each photo (grid layout)
  // // Desktop layout: 5 photos in a row with slight organic spacing
  // const desktopPositions = [
  //   { x: -360, y: -20, rotation: -2 },   // Photo 1
  //   { x: -180, y: 10, rotation: 1 },     // Photo 2
  //   { x: 0, y: -10, rotation: -1 },      // Photo 3
  //   { x: 180, y: 15, rotation: 2 },      // Photo 4
  //   { x: 360, y: -15, rotation: -1 }     // Photo 5
  // ];

  // // Tablet layout: 3 top, 2 bottom
  // const tabletPositions = [
  //   { x: -150, y: -90, rotation: -1 },   // Photo 1
  //   { x: 0, y: -85, rotation: 1 },       // Photo 2
  //   { x: 150, y: -95, rotation: -2 },    // Photo 3
  //   { x: -75, y: 90, rotation: 2 },      // Photo 4
  //   { x: 75, y: 85, rotation: -1 }       // Photo 5
  // ];

  // // Mobile layout: 2-2-1
  // const mobilePositions = [
  //   { x: -55, y: -170, rotation: -1 },   // Photo 1
  //   { x: 55, y: -170, rotation: 2 },     // Photo 2
  //   { x: -55, y: 0, rotation: -2 },      // Photo 3
  //   { x: 55, y: 0, rotation: 1 },        // Photo 4
  //   { x: 0, y: 170, rotation: -1 }       // Photo 5
  // ];

  // // Get current positions based on screen size
  // function getCurrentPositions() {
  //   const width = window.innerWidth;
  //   if (width <= 480) return mobilePositions;
  //   if (width <= 768) return tabletPositions;
  //   return desktopPositions;
  // }

//   // Initialize photos - all in center, hidden
//   photos.forEach((photo, index) => {
//     // Add inner div for the photo content
//     if (!photo.querySelector('.photo-inner')) {
//       const inner = document.createElement('div');
//       inner.className = 'photo-inner';
//       photo.appendChild(inner);
//     }

//     // Set initial state
//     gsap.set(photo, {
//       x: 0,
//       y: 0,
//       rotation: 0,
//       // opacity: 0,
//       scale: 1
//     });
//   });

//   // Scatter animation
//   function scatterPhotos() {
//     const positions = getCurrentPositions();
    
//     // Hide button
//     // gsap.to(scatterBtn, {
//     //   opacity: 0,
//     //   scale: 0.8,
//     //   duration: 0.3,
//     //   ease: "power2.in",
//     //   onComplete: () => {
//     //     scatterBtn.style.pointerEvents = 'none';
//     //   }
//     // });

//     // Animate each photo to its position
//     photos.forEach((photo, index) => {
//       gsap.to(photo, {
//         x: positions[index].x,
//         y: positions[index].y,
//         rotation: positions[index].rotation,
//         opacity: 1,
//         duration: 0.8,
//         delay: index * 0.1,
//         ease: "back.out(1.2)",
//         onStart: () => {
//           photo.classList.add('scattered');
//         }
//       });
//     });

//     // Show gather button after animation
//     gsap.to(scatterBtn, {
//       opacity: 1,
//       scale: 1,
//       duration: 0.3,
//       delay: photos.length * 0.1 + 0.8,
//       ease: "power2.out",
//       onStart: () => {
//         scatterBtn.textContent = 'Gather Back';
//         scatterBtn.style.pointerEvents = 'all';
//       }
//     });
//   }

//   // Gather animation
//   function gatherPhotos() {
//     // Hide button
//     gsap.to(scatterBtn, {
//       opacity: 0,
//       scale: 0.8,
//       duration: 0.3,
//       ease: "power2.in",
//       onComplete: () => {
//         scatterBtn.style.pointerEvents = 'none';
//       }
//     });

//     // Animate each photo back to center
//     photos.forEach((photo, index) => {
//       gsap.to(photo, {
//         x: 0,
//         y: 0,
//         rotation: 0,
//         opacity: 0,
//         duration: 0.6,
//         delay: (photos.length - index - 1) * 0.08,
//         ease: "power2.in",
//         onComplete: () => {
//           if (index === 0) {
//             photo.classList.remove('scattered');
//           }
//         }
//       });
//     });

//     // Show scatter button after animation
//     gsap.to(scatterBtn, {
//       opacity: 1,
//       scale: 1,
//       duration: 0.3,
//       delay: photos.length * 0.08 + 0.6,
//       ease: "power2.out",
//       onStart: () => {
//         scatterBtn.textContent = 'See the Moments';
//         scatterBtn.style.pointerEvents = 'all';
//       }
//     });
//   }

//   // Button click handler
//   scatterBtn.addEventListener('click', () => {
//     if (!isScattered) {
//       scatterPhotos();
//       isScattered = true;
//     } else {
//       gatherPhotos();
//       isScattered = false;
//     }
//   });

//   // Hover effect for individual photos
//   photos.forEach((photo) => {
//     photo.addEventListener('mouseenter', function() {
//       if (isScattered) {
//         gsap.to(this, {
//           scale: 1.08,
//           duration: 0.3,
//           ease: "power2.out"
//         });
//       }
//     });

//     photo.addEventListener('mouseleave', function() {
//       if (isScattered) {
//         gsap.to(this, {
//           scale: 1,
//           duration: 0.3,
//           ease: "power2.out"
//         });
//       }
//     });
//   });

//   // Handle window resize - reposition photos if scattered
//   let resizeTimeout;
//   window.addEventListener('resize', () => {
//     clearTimeout(resizeTimeout);
//     resizeTimeout = setTimeout(() => {
//       if (isScattered) {
//         const positions = getCurrentPositions();
//         photos.forEach((photo, index) => {
//           gsap.to(photo, {
//             x: positions[index].x,
//             y: positions[index].y,
//             duration: 0.4,
//             ease: "power2.out"
//           });
//         });
//       }
//     }, 200);
//   });

//   // Optional: Keyboard shortcut (Space bar) to toggle
//   document.addEventListener('keydown', (e) => {
//     if (e.code === 'Space') {
//       const rect = photoArea.getBoundingClientRect();
//       const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
//       if (isInView) {
//         e.preventDefault();
//         scatterBtn.click();
//       }
//     }
//   });

// });

//   scatterBtn.addEventListener('click', () => {
//     if (!isScattered) {
//       scatterPhotos();
//       isScattered = true;
//     } else {
//       gatherPhotos();
//       isScattered = false;
//     }
//   });

//   scat.addEventListener('click', () =>{
//     gsap.to( '.bts-item', {duration: 2, x:'-50vw', y:'-50vh' , ease: 'bounce'})

   })