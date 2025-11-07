// Timeline horizontal scroll animation
window.addEventListener('DOMContentLoaded', function() {
  
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded for timeline.');
    return;
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Get timeline elements
  const timelineSection = document.querySelector(".timeline-section");
  const timelineContainer = document.querySelector(".timeline-container");
  
  if (!timelineContainer || !timelineSection) {
    console.warn('Timeline container not found');
    return;
  }

  const timelineSections = gsap.utils.toArray(".timeline-container section");
  const timelineMask = document.querySelector(".timeline-mask-rect");

  if (timelineSections.length === 0) {
    console.warn('No timeline sections found');
    return;
  }

  // Add a trigger spacer before timeline to ensure proper scroll positioning
  const triggerSpacer = document.createElement('div');
  triggerSpacer.style.height = '1px';
  triggerSpacer.style.pointerEvents = 'none';
  timelineSection.parentNode.insertBefore(triggerSpacer, timelineSection);

  // Calculate proper end value based on sections
  const scrollDistance = (timelineSections.length - 1) * window.innerWidth;

  // Horizontal scroll animation
  let scrollTween = gsap.to(timelineSections, {
    xPercent: -100 * (timelineSections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: timelineSection,
      pin: ".timeline-container",
      scrub: 1,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      markers: false, // Set to true for debugging
    }
  });

  // Progress bar animation
  if (timelineMask) {
    gsap.to(timelineMask, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: timelineSection,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }

  // Animate text in sections
  timelineSections.forEach((section, index) => {
    let text = section.querySelectorAll(".timeline-anim");
    
    if (text.length === 0) return;
    
    gsap.from(text, { 
      y: -130,
      opacity: 0,
      duration: 2,
      ease: "elastic",
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        containerAnimation: scrollTween,
        start: "left center",
        toggleActions: "play none none reverse",
        markers: false // Set to true for debugging
      }
    });
  });

  // Refresh ScrollTrigger after a brief delay to ensure proper calculations
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

});