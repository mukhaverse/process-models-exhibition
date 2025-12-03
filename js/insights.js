// Render insights accordion cards (updated for Alternative 3)
function renderInsights() {
    const insightsGrid = document.getElementById('insightsGrid');
    if (!insightsGrid || !appData.insights) return;

    insightsGrid.innerHTML = appData.insights.map(insight => `
        <div class="insight-card" data-insight-id="${insight.id}">
            <div class="insight-header">
                <div class="insight-question-group">
                    <div class="insight-number">${insight.number}</div>
                    <div class="insight-question">${insight.question}</div>
                </div>
                <div class="accordion-toggle">+</div>
            </div>
            
            <div class="insight-content-wrapper" id="content-q${insight.id}">
                <div class="insight-content">
                    <div class="insight-answer">${insight.answer}</div>
                    <div class="insight-context">${insight.context}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Insight cards accordion functionality (updated for Alternative 3)
function initFlipCards() {
    const insightCards = document.querySelectorAll('.insight-card');
    
    insightCards.forEach(card => {
        const header = card.querySelector('.insight-header');
        const contentWrapper = card.querySelector('.insight-content-wrapper');
        
        // Initial state for GSAP: collapse the content
        gsap.set(contentWrapper, { height: 0 });
        
        header.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                gsap.to(contentWrapper, { 
                    height: 0, 
                    duration: 0.5, 
                    ease: 'power3.out' 
                });
                card.classList.remove('expanded');
                card.style.zIndex = 10; // Restore default Z-index
            } else {
                // Expand
                // 1. Collapse any other open cards
                document.querySelectorAll('.insight-card.expanded').forEach(openCard => {
                    const openContentWrapper = openCard.querySelector('.insight-content-wrapper');
                    gsap.to(openContentWrapper, { 
                        height: 0, 
                        duration: 0.5, 
                        ease: 'power3.out' 
                    });
                    openCard.classList.remove('expanded');
                    openCard.style.zIndex = 10;
                });
                
                // 2. Expand current card
                gsap.to(contentWrapper, { 
                    height: 'auto', 
                    duration: 0.5, 
                    ease: 'power3.out' 
                });
                card.classList.add('expanded');
                card.style.zIndex = 20; // Bring to front when expanded
            }
        });
    });
}