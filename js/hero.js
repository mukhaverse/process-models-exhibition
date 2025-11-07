// Wait for both DOM and GSAP to be ready
window.addEventListener('DOMContentLoaded', function() {
  
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Hero animations will not work.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Get elements
  const statsSection = document.querySelector('.stats-section');
  const hero = document.getElementById('hero');
  const body = document.body;

  // Only proceed if hero elements exist
  if (!hero || !statsSection) {
    console.warn('Hero or stats section not found');
    return;
  }

  // Initial entrance animations
  const tl = gsap.timeline({ 
    defaults: { ease: "power3.out" }
  });
  
  tl.to(".headline", { opacity: 1, x: 0, duration: 1, delay: 0.2 })
    .to(".subheadline", { opacity: 1, x: 0, duration: 1 }, "-=0.7")
    .to(".description", { opacity: 1, x: 0, duration: 1 }, "-=0.7")
    .to(".cta-button", { opacity: 1, x: 0, duration: 1 }, "-=0.7")
    .to(".content-right", { opacity: 1, scale: 1, duration: 1 }, "-=1")
    .to(".scroll-indicator", { opacity: 1, duration: 1 }, "-=0.5");

  // Scroll indicator bounce
  gsap.to(".scroll-indicator", {
    y: -10,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    delay: 2
  });

  // Circle shrink animation with ScrollTrigger
  let statsAnimated = false;
  let isAnimating = true;
  let scrollProgress = 0;
  let targetProgress = 0;
  let animationComplete = false;

  window.addEventListener('wheel', (e) => {
    // Only intercept scroll during the hero transition phase
    if (!animationComplete) {
      e.preventDefault();
      
      // Update target progress based on wheel movement (both up and down)
      targetProgress += e.deltaY * 0.0008;
      targetProgress = Math.max(0, Math.min(1, targetProgress));
      
      // Check if scrolling back to beginning
      if (targetProgress < 0.05) {
        isAnimating = true;
        animationComplete = false;
      }
      
      // Once animation reaches near completion, mark as complete
      if (targetProgress >= 0.99 && e.deltaY > 0) {
        animationComplete = true;
        isAnimating = false;
        
        // Completely transition to normal scrolling
        setTimeout(() => {
          hero.style.display = 'none';
          statsSection.style.position = 'relative';
          statsSection.style.opacity = 1;
          body.style.overflow = 'auto';
          
          // CRITICAL: Refresh ScrollTrigger after changing layout
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
        }, 100);
      }
    } else {
      // Check if user scrolls back up to the top
      if (window.scrollY === 0 && e.deltaY < 0) {
        e.preventDefault();
        animationComplete = false;
        isAnimating = true;
        targetProgress = 0.8; // Start from near-end of animation
        
        // Reset to fixed positioning
        hero.style.display = 'flex';
        statsSection.style.position = 'fixed';
        body.style.overflow = 'hidden';
        
        // CRITICAL: Refresh ScrollTrigger after changing layout
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    }
  }, { passive: false });

  // Smooth animation loop
  function animateTransition() {
    // Smoothly interpolate towards target
    scrollProgress += (targetProgress - scrollProgress) * 0.1;
    
    // Apply effects based on progress
    const inset = scrollProgress * 45;
    const radius = scrollProgress * 50;
    const scale = 1 - (scrollProgress * 0.3);
    
    hero.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}%)`;
    hero.style.transform = `scale(${scale})`;
    
    // Manage hero opacity and display
    if (scrollProgress > 0.85) {
      hero.style.opacity = Math.max(0, 1 - ((scrollProgress - 0.85) * 6.67));
    } else if (scrollProgress > 0.65) {
      hero.style.opacity = 1 - ((scrollProgress - 0.65) * 5);
    } else {
      hero.style.opacity = 1;
    }
    
    // Show hero when scrolling back
    if (scrollProgress < 0.9 && hero.style.display === 'none') {
      hero.style.display = 'flex';
    }
    
    // Manage stats section opacity
    if (scrollProgress > 0.6) {
      statsSection.style.opacity = Math.min(1, (scrollProgress - 0.6) * 2.5);
    } else {
      statsSection.style.opacity = 0;
    }
    
    // Trigger stats animation when going forward past 70%
    if (scrollProgress > 0.7 && !statsAnimated) {
      statsAnimated = true;
      animateStats();
    }
    
    // Reset stats when scrolling back below 70%
    if (scrollProgress < 0.7 && statsAnimated) {
      statsAnimated = false;
      // Reset stat opacities
      document.querySelectorAll('.stat').forEach(stat => {
        stat.style.opacity = 0;
      });
      // Reset counter values
      document.querySelectorAll('.counter').forEach(counter => {
        counter.textContent = '0';
      });
    }
    
    requestAnimationFrame(animateTransition);
  }

  animateTransition();

  // Stats entrance animation
  function animateStats() {
    gsap.to(".stat", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });

    document.querySelectorAll('.counter').forEach(counter => {
      animateCounter(counter);
    });
  }

  // Counter animation
  function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const obj = { value: 0 };
    
    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: "power1.out",
      onUpdate: function() {
        counter.textContent = Math.ceil(obj.value);
      }
    });
  }

});