// Render insights flip cards
function renderInsights() {
    const insightsGrid = document.getElementById('insightsGrid');
    if (!insightsGrid || !appData.insights) return;

    insightsGrid.innerHTML = appData.insights.map(insight => `
        <div class="insight-card" data-insight-id="${insight.id}">
            <div class="insight-card-inner">
                <div class="insight-card-front">
                    <div>
                        <div class="insight-number">${insight.number}</div>
                        <div class="insight-question">${insight.question}</div>
                        <div class="insight-prompt">${insight.prompt}</div>
                    </div>
                    <div class="click-hint">Click to Flip</div>
                </div>
                <div class="insight-card-back">
                    <div>
                        <div class="insight-number">${insight.number}</div>
                        <div class="insight-question">${insight.question}</div>
                        <div class="insight-answer">${insight.answer}</div>
                        <div class="insight-context">${insight.context}</div>
                    </div>
                    <div class="click-hint">Click to Flip Back</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Insight cards flip functionality
function initFlipCards() {
    const insightCards = document.querySelectorAll('.insight-card');
    
    insightCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}