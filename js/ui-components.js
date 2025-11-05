/**
 * VocabLab UI Components
 * Toast notifications, loading states, and other UI helpers
 */

const VocabLabUI = (function() {
    'use strict';

    // Toast notification queue
    let toastQueue = [];
    let isShowingToast = false;

    /**
     * Show toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type: 'success', 'error', 'info', 'warning'
     * @param {number} duration - Duration in ms (default 3000)
     */
    function showToast(message, type = 'info', duration = 3000) {
        const toast = {
            id: Date.now(),
            message,
            type,
            duration
        };

        toastQueue.push(toast);

        if (!isShowingToast) {
            displayNextToast();
        }
    }

    function displayNextToast() {
        if (toastQueue.length === 0) {
            isShowingToast = false;
            return;
        }

        isShowingToast = true;
        const toast = toastQueue.shift();

        // Create toast container if it doesn't exist
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-${toast.type}`;
        toastEl.innerHTML = `
            <div class="toast-icon">${getToastIcon(toast.type)}</div>
            <div class="toast-message">${toast.message}</div>
            <button class="toast-close" onclick="VocabLabUI.closeToast(this)">&times;</button>
        `;

        container.appendChild(toastEl);

        // Animate in
        setTimeout(() => toastEl.classList.add('toast-show'), 10);

        // Auto remove
        setTimeout(() => {
            removeToast(toastEl);
        }, toast.duration);
    }

    function removeToast(toastEl) {
        toastEl.classList.remove('toast-show');
        setTimeout(() => {
            if (toastEl.parentNode) {
                toastEl.parentNode.removeChild(toastEl);
            }
            displayNextToast();
        }, 300);
    }

    function closeToast(button) {
        const toastEl = button.closest('.toast');
        removeToast(toastEl);
    }

    function getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Show loading spinner
     * @param {string} target - CSS selector or element
     * @param {string} message - Optional loading message
     */
    function showLoading(target = 'body', message = 'Loading...') {
        const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetEl) return;

        const loadingId = 'loading-' + Date.now();
        const loadingEl = document.createElement('div');
        loadingEl.id = loadingId;
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;

        targetEl.style.position = 'relative';
        targetEl.appendChild(loadingEl);

        return loadingId;
    }

    /**
     * Hide loading spinner
     * @param {string} loadingId - ID returned from showLoading
     */
    function hideLoading(loadingId) {
        if (!loadingId) {
            // Remove all loading overlays
            document.querySelectorAll('.loading-overlay').forEach(el => el.remove());
            return;
        }

        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.classList.add('loading-fade-out');
            setTimeout(() => loadingEl.remove(), 300);
        }
    }

    /**
     * Show skeleton screen
     * @param {string} target - CSS selector
     * @param {number} count - Number of skeleton items
     */
    function showSkeleton(target, count = 3) {
        const targetEl = document.querySelector(target);
        if (!targetEl) return;

        targetEl.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-item';
            skeleton.innerHTML = `
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text short"></div>
            `;
            targetEl.appendChild(skeleton);
        }
    }

    /**
     * Show saving indicator
     * @param {string} message - Saving message
     */
    function showSaving(message = 'Saving...') {
        let savingIndicator = document.getElementById('saving-indicator');

        if (!savingIndicator) {
            savingIndicator = document.createElement('div');
            savingIndicator.id = 'saving-indicator';
            savingIndicator.className = 'saving-indicator';
            document.body.appendChild(savingIndicator);
        }

        savingIndicator.innerHTML = `
            <div class="saving-content">
                <div class="saving-spinner"></div>
                <span>${message}</span>
            </div>
        `;
        savingIndicator.classList.add('saving-show');
    }

    /**
     * Hide saving indicator
     * @param {boolean} success - Whether save was successful
     * @param {string} message - Optional message
     */
    function hideSaving(success = true, message = null) {
        const savingIndicator = document.getElementById('saving-indicator');
        if (!savingIndicator) return;

        if (message) {
            savingIndicator.innerHTML = `
                <div class="saving-content">
                    <span>${success ? '✓' : '✕'}</span>
                    <span>${message}</span>
                </div>
            `;
            savingIndicator.className = `saving-indicator saving-show ${success ? 'saving-success' : 'saving-error'}`;

            setTimeout(() => {
                savingIndicator.classList.remove('saving-show');
            }, 2000);
        } else {
            savingIndicator.classList.remove('saving-show');
        }
    }

    /**
     * Show tutorial/onboarding modal
     */
    function showTutorial() {
        // Check if user has seen tutorial
        if (localStorage.getItem('vocablab_tutorial_seen') === 'true') {
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'tutorial-modal';
        modal.className = 'modal-overlay tutorial-modal';
        modal.innerHTML = `
            <div class="modal-content tutorial-content">
                <button class="modal-close" onclick="VocabLabUI.closeTutorial()">&times;</button>
                <h2>Welcome to VocabLab! 🎓</h2>
                <div class="tutorial-steps">
                    <div class="tutorial-step active" data-step="1">
                        <div class="tutorial-step-number">1</div>
                        <h3>Choose Your Theme</h3>
                        <p>Select from 6 vocabulary themes including Daily Life, Technology, Business, and more. Each theme has 60 words across three difficulty levels.</p>
                    </div>
                    <div class="tutorial-step" data-step="2">
                        <div class="tutorial-step-number">2</div>
                        <h3>Select Your Level</h3>
                        <p>Pick Easy, Medium, or Hard difficulty based on your skill level. You can also choose "All Levels" to practice everything!</p>
                    </div>
                    <div class="tutorial-step" data-step="3">
                        <div class="tutorial-step-number">3</div>
                        <h3>Play & Learn</h3>
                        <p>Choose from 7 interactive games including matching, spelling, scramble, and more. Your progress is automatically saved!</p>
                    </div>
                    <div class="tutorial-step" data-step="4">
                        <div class="tutorial-step-number">4</div>
                        <h3>Join a Class</h3>
                        <p>If you have a class code from your teacher, click "Join a Class" to track your progress and compete with classmates!</p>
                    </div>
                </div>
                <div class="tutorial-navigation">
                    <button class="btn btn-secondary" id="tutorial-prev" disabled>Previous</button>
                    <div class="tutorial-dots">
                        <span class="tutorial-dot active" data-step="1"></span>
                        <span class="tutorial-dot" data-step="2"></span>
                        <span class="tutorial-dot" data-step="3"></span>
                        <span class="tutorial-dot" data-step="4"></span>
                    </div>
                    <button class="btn btn-primary" id="tutorial-next">Next</button>
                </div>
                <label class="tutorial-checkbox">
                    <input type="checkbox" id="tutorial-dont-show">
                    <span>Don't show this again</span>
                </label>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('modal-show'), 10);

        // Tutorial navigation
        let currentStep = 1;
        const totalSteps = 4;

        document.getElementById('tutorial-next').addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateTutorialStep(currentStep);
            } else {
                closeTutorial();
            }
        });

        document.getElementById('tutorial-prev').addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateTutorialStep(currentStep);
            }
        });

        // Click dots to navigate
        document.querySelectorAll('.tutorial-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentStep = parseInt(dot.dataset.step);
                updateTutorialStep(currentStep);
            });
        });

        function updateTutorialStep(step) {
            // Update active step
            document.querySelectorAll('.tutorial-step').forEach(el => {
                el.classList.remove('active');
                if (parseInt(el.dataset.step) === step) {
                    el.classList.add('active');
                }
            });

            // Update dots
            document.querySelectorAll('.tutorial-dot').forEach(dot => {
                dot.classList.remove('active');
                if (parseInt(dot.dataset.step) === step) {
                    dot.classList.add('active');
                }
            });

            // Update buttons
            document.getElementById('tutorial-prev').disabled = step === 1;
            document.getElementById('tutorial-next').textContent = step === totalSteps ? 'Get Started' : 'Next';
        }
    }

    function closeTutorial() {
        const modal = document.getElementById('tutorial-modal');
        if (!modal) return;

        const dontShow = document.getElementById('tutorial-dont-show');
        if (dontShow && dontShow.checked) {
            localStorage.setItem('vocablab_tutorial_seen', 'true');
        }

        modal.classList.remove('modal-show');
        setTimeout(() => modal.remove(), 300);
    }

    /**
     * Show "How to Play" modal for a game
     * @param {Object} gameInfo - Game information
     */
    function showHowToPlay(gameInfo) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay how-to-play-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <h2>How to Play: ${gameInfo.name}</h2>
                <div class="how-to-play-content">
                    <div class="how-to-play-objective">
                        <h3>Objective</h3>
                        <p>${gameInfo.objective}</p>
                    </div>
                    <div class="how-to-play-instructions">
                        <h3>Instructions</h3>
                        <ol>
                            ${gameInfo.instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    ${gameInfo.tips ? `
                        <div class="how-to-play-tips">
                            <h3>Tips</h3>
                            <ul>
                                ${gameInfo.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${gameInfo.videoUrl ? `
                        <div class="how-to-play-video">
                            <h3>Watch Demo</h3>
                            <div class="video-placeholder">
                                <p>Video demonstration: <a href="${gameInfo.videoUrl}" target="_blank">Watch on YouTube</a></p>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Got It!</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    /**
     * Show quick tip during gameplay
     * @param {string} tip - Tip message
     * @param {number} duration - Duration in ms
     */
    function showQuickTip(tip, duration = 5000) {
        let tipEl = document.getElementById('quick-tip');

        if (!tipEl) {
            tipEl = document.createElement('div');
            tipEl.id = 'quick-tip';
            tipEl.className = 'quick-tip';
            document.body.appendChild(tipEl);
        }

        tipEl.innerHTML = `
            <div class="quick-tip-content">
                <span class="quick-tip-icon">💡</span>
                <span class="quick-tip-text">${tip}</span>
            </div>
        `;

        tipEl.classList.add('quick-tip-show');

        setTimeout(() => {
            tipEl.classList.remove('quick-tip-show');
        }, duration);
    }

    // Public API
    return {
        showToast,
        closeToast,
        showLoading,
        hideLoading,
        showSkeleton,
        showSaving,
        hideSaving,
        showTutorial,
        closeTutorial,
        showHowToPlay,
        showQuickTip
    };
})();

// Auto-show tutorial on homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            VocabLabUI.showTutorial();
        }, 500);
    });
}
