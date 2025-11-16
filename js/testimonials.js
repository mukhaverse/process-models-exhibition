// Render testimonials
function renderTestimonials() {
    const feedbackCarousel = document.getElementById('feedbackCarousel');
    if (!feedbackCarousel || !appData.testimonials) return;

    // Duplicate testimonials for seamless scrolling
    const duplicatedTestimonials = [...appData.testimonials, ...appData.testimonials];
    
    feedbackCarousel.innerHTML = duplicatedTestimonials.map(testimonial => `
        <div class="feedback-card">
            <p class="feedback-text">"${testimonial.text}"</p>
            <p class="feedback-author">— ${testimonial.author}</p>
        </div>
    `).join('');
}