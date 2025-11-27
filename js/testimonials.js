// Feedback/Testimonials System
let feedbacks = [];
let currentFeedbackIndex = 0;

// Initialize feedback system
function initFeedbackSystem() {
    loadFeedbacks();
    setupFeedbackEventListeners();
}

// Load feedbacks from storage
async function loadFeedbacks() {
    try {
        const result = await window.storage.get('exhibition-feedbacks', true);
        if (result && result.value) {
            feedbacks = JSON.parse(result.value);
        }
    } catch (error) {
        console.log('No feedbacks yet or error loading:', error);
        feedbacks = [];
    }
    renderFeedbacks();
}

// Save feedbacks to storage
async function saveFeedbacks() {
    try {
        await window.storage.set('exhibition-feedbacks', JSON.stringify(feedbacks), true);
        return true;
    } catch (error) {
        console.error('Error saving feedback:', error);
        return false;
    }
}

// Render feedbacks carousel
function renderFeedbacks() {
    const carousel = document.getElementById('feedbackCarousel');
    const emptyState = document.getElementById('feedbackEmpty');
    const navContainer = document.getElementById('feedbackNav');

    if (!carousel) return;

    // Clear carousel
    carousel.innerHTML = '';

    if (feedbacks.length === 0) {
        if (emptyState) emptyState.classList.add('active');
        if (navContainer) navContainer.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.classList.remove('active');
    if (navContainer) navContainer.style.display = feedbacks.length > 1 ? 'flex' : 'none';

    // Create feedback cards
    feedbacks.forEach((feedback, index) => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        if (index === currentFeedbackIndex) {
            card.classList.add('active');
        }

        card.innerHTML = `
            <div class="feedback-message">"${escapeHtml(feedback.message)}"</div>
            <div class="feedback-footer">
                <div>
                    <div class="feedback-author">${escapeHtml(feedback.name)}</div>
                    <div class="feedback-role">${escapeHtml(feedback.role)}</div>
                </div>
                <button class="feedback-like-btn" onclick="handleFeedbackLike(${feedback.id})">
                    ♥ ${feedback.likes || 0}
                </button>
            </div>
        `;

        carousel.appendChild(card);
    });
}


// Handle like button
function handleFeedbackLike(id) {
    feedbacks = feedbacks.map(f => {
        if (f.id === id) {
            return { ...f, likes: (f.likes || 0) + 1 };
        }
        return f;
    });
    saveFeedbacks();
    renderFeedbacks();
}

// Navigation
function showNextFeedback() {
    if (feedbacks.length === 0) return;
    currentFeedbackIndex = (currentFeedbackIndex + 1) % feedbacks.length;
    renderFeedbacks();
}

function showPrevFeedback() {
    if (feedbacks.length === 0) return;
    currentFeedbackIndex = currentFeedbackIndex === 0 ? feedbacks.length - 1 : currentFeedbackIndex - 1;
    renderFeedbacks();
}

// Setup event listeners
function setupFeedbackEventListeners() {
    // Toggle form button
    const toggleBtn = document.getElementById('feedbackToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const formContainer = document.getElementById('feedbackFormContainer');
            if (formContainer) {
                const isActive = formContainer.classList.toggle('active');
                toggleBtn.textContent = isActive ? 'Cancel' : 'Share Your Thoughts';
            }
        });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('feedbackPrevBtn');
    const nextBtn = document.getElementById('feedbackNextBtn');
    if (prevBtn) prevBtn.addEventListener('click', showPrevFeedback);
    if (nextBtn) nextBtn.addEventListener('click', showNextFeedback);

    // Submit button
    const submitBtn = document.getElementById('feedbackSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleFeedbackSubmit);
    }
}

// Handle form submission
async function handleFeedbackSubmit() {
    const nameInput = document.getElementById('feedbackName');
    const roleInput = document.getElementById('feedbackRole');
    const messageInput = document.getElementById('feedbackMessage');
    const submitBtn = document.getElementById('feedbackSubmitBtn');

    if (!nameInput || !roleInput || !messageInput) return;

    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !role || !message) {
        alert('Please fill in all fields');
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Create new feedback
    const newFeedback = {
        id: Date.now(),
        name: name,
        role: role,
        message: message,
        timestamp: new Date().toISOString(),
        likes: 0
    };

    // Add to beginning of array
    feedbacks.unshift(newFeedback);

    // Save
    const success = await saveFeedbacks();

    if (success) {
        // Reset form
        nameInput.value = '';
        roleInput.value = '';
        messageInput.value = '';

        // Hide form
        const formContainer = document.getElementById('feedbackFormContainer');
        const toggleBtn = document.getElementById('feedbackToggleBtn');
        if (formContainer) formContainer.classList.remove('active');
        if (toggleBtn) toggleBtn.textContent = 'Share Your Thoughts';

        // Update display
        currentFeedbackIndex = 0;
        renderFeedbacks();
    }

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Feedback';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedbackSystem);
} else {
    initFeedbackSystem();
}