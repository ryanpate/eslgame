// Main JavaScript file for Halloween Vocabulary Game

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Prevent double-click on buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('no-disable')) {
                this.disabled = true;
                setTimeout(() => {
                    this.disabled = false;
                }, 1000);
            }
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close popups
    if (e.key === 'Escape') {
        const popups = document.querySelectorAll('.popup:not(.hidden)');
        popups.forEach(popup => {
            popup.classList.add('hidden');
        });
    }
});

// Utility function for shuffling arrays
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Add to Jinja2 environment for template use
if (typeof window !== 'undefined') {
    window.shuffleArray = shuffleArray;
}

// Add celebration effect
function celebrate() {
    const colors = ['#ff6b35', '#f7931e', '#9b59b6', '#2ecc71'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * 100}%;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
        pointer-events: none;
        z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => confetti.remove();
}

// Make celebrate function available globally
if (typeof window !== 'undefined') {
    window.celebrate = celebrate;
}

// Sound effects (optional - can be added later)
const sounds = {
    correct: () => console.log('Correct sound!'),
    wrong: () => console.log('Wrong sound!'),
    complete: () => console.log('Complete sound!')
};

// Add visual feedback for interactions
document.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Local storage for tracking progress (optional)
const GameProgress = {
    save: function(gameType, score, level) {
        const key = `halloween_vocab_${gameType}`;
        const data = {
            score: score,
            level: level,
            date: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
    },
    
    load: function(gameType) {
        const key = `halloween_vocab_${gameType}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    
    clear: function() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('halloween_vocab_')) {
                localStorage.removeItem(key);
            }
        });
    }
};

// Make GameProgress available globally
if (typeof window !== 'undefined') {
    window.GameProgress = GameProgress;
}
