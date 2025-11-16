
  gsap.registerPlugin(ScrollTrigger);

  // Animate the .stat boxes when section comes into view
  gsap.from(".stat", {
    scrollTrigger: {
      trigger: ".stats-section",
      start: "top 80%", // starts when section is 80% in view
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2, // each stat comes slightly after the other
    ease: "power3.out",
    onComplete: startCounters // start counting after fade-in
  });

  function startCounters() {
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const duration = 1.5; // seconds
      const frameRate = 50; // smoother animation
      const totalFrames = duration * frameRate;
      let frame = 0;

      const count = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const value = Math.floor(target * progress);
        counter.textContent = value;

        if (frame === totalFrames) {
          counter.textContent = target;
          clearInterval(count);
        }
      }, 1000 / frameRate);
    });
  }

