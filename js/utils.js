/**
 * VocabLab Performance & Mobile Utilities
 * Handles lazy loading, error handling, form validation, and mobile optimization
 */

const VocabLabUtils = (function() {
    'use strict';

    // ============================================
    // PERFORMANCE - LAZY LOADING
    // ============================================

    /**
     * Lazy load images when they enter viewport
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Lazy load scripts
     * @param {string} src - Script source URL
     * @param {Function} callback - Callback after load
     */
    function lazyLoadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        script.onload = () => {
            if (callback) callback();
        };

        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            if (typeof VocabLabUI !== 'undefined') {
                VocabLabUI.showToast('Failed to load required component', 'error');
            }
        };

        document.head.appendChild(script);
    }

    /**
     * Defer non-critical CSS
     * @param {string} href - CSS file URL
     */
    function deferCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() {
            this.media = 'all';
        };
        document.head.appendChild(link);
    }

    // ============================================
    // ERROR HANDLING
    // ============================================

    /**
     * Global error handler
     */
    function initErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            handleError(event.error, 'An unexpected error occurred');
        });

        // Handle promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            handleError(event.reason, 'An error occurred while processing your request');
        });
    }

    /**
     * Handle errors with user-friendly messages
     * @param {Error} error - The error object
     * @param {string} userMessage - User-friendly message
     */
    function handleError(error, userMessage = 'Something went wrong') {
        console.error('Error details:', error);

        // Show user-friendly message
        if (typeof VocabLabUI !== 'undefined') {
            VocabLabUI.showToast(userMessage, 'error');
        } else {
            alert(userMessage);
        }

        // Log to console for debugging
        if (error && error.message) {
            console.error('Error message:', error.message);
        }
        if (error && error.stack) {
            console.error('Stack trace:', error.stack);
        }
    }

    /**
     * Safe async function wrapper
     * @param {Function} fn - Async function to wrap
     * @param {string} errorMessage - Custom error message
     */
    function safeAsync(fn, errorMessage) {
        return async function(...args) {
            try {
                return await fn.apply(this, args);
            } catch (error) {
                handleError(error, errorMessage);
                return null;
            }
        };
    }

    // ============================================
    // FORM VALIDATION
    // ============================================

    /**
     * Validate form with helpful feedback
     * @param {HTMLFormElement} form - Form to validate
     * @param {Object} rules - Validation rules
     */
    function validateForm(form, rules) {
        let isValid = true;
        const errors = {};

        // Clear previous errors
        clearFormErrors(form);

        // Validate each field
        Object.keys(rules).forEach(fieldName => {
            const field = form.elements[fieldName];
            const rule = rules[fieldName];

            if (!field) return;

            // Required validation
            if (rule.required && !field.value.trim()) {
                errors[fieldName] = rule.requiredMessage || 'This field is required';
                isValid = false;
            }

            // Min length validation
            if (rule.minLength && field.value.length < rule.minLength) {
                errors[fieldName] = rule.minLengthMessage ||
                    `Must be at least ${rule.minLength} characters`;
                isValid = false;
            }

            // Max length validation
            if (rule.maxLength && field.value.length > rule.maxLength) {
                errors[fieldName] = rule.maxLengthMessage ||
                    `Must be no more than ${rule.maxLength} characters`;
                isValid = false;
            }

            // Pattern validation
            if (rule.pattern && !rule.pattern.test(field.value)) {
                errors[fieldName] = rule.patternMessage || 'Invalid format';
                isValid = false;
            }

            // Email validation
            if (rule.email && !isValidEmail(field.value)) {
                errors[fieldName] = 'Please enter a valid email address';
                isValid = false;
            }

            // Custom validation
            if (rule.custom && !rule.custom(field.value)) {
                errors[fieldName] = rule.customMessage || 'Invalid value';
                isValid = false;
            }

            // Show error for this field
            if (errors[fieldName]) {
                showFieldError(field, errors[fieldName]);
            }
        });

        return { isValid, errors };
    }

    /**
     * Show error for a specific field
     */
    function showFieldError(field, message) {
        field.classList.add('field-error');

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-message';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);

        // Add focus listener to clear error
        field.addEventListener('focus', function clearError() {
            field.classList.remove('field-error');
            const errorMsg = field.parentElement.querySelector('.field-error-message');
            if (errorMsg) errorMsg.remove();
            field.removeEventListener('focus', clearError);
        }, { once: true });
    }

    /**
     * Clear all form errors
     */
    function clearFormErrors(form) {
        form.querySelectorAll('.field-error').forEach(field => {
            field.classList.remove('field-error');
        });
        form.querySelectorAll('.field-error-message').forEach(msg => {
            msg.remove();
        });
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ============================================
    // MOBILE OPTIMIZATION
    // ============================================

    /**
     * Detect if device is mobile
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    /**
     * Detect if device supports touch
     */
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Add swipe gesture support
     * @param {HTMLElement} element - Element to add swipe to
     * @param {Object} callbacks - { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }
     */
    function addSwipeGesture(element, callbacks) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        const minSwipeDistance = 50;

        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0 && callbacks.onSwipeLeft) {
                        callbacks.onSwipeLeft();
                    } else if (diffX < 0 && callbacks.onSwipeRight) {
                        callbacks.onSwipeRight();
                    }
                }
            }
            // Vertical swipe
            else {
                if (Math.abs(diffY) > minSwipeDistance) {
                    if (diffY > 0 && callbacks.onSwipeUp) {
                        callbacks.onSwipeUp();
                    } else if (diffY < 0 && callbacks.onSwipeDown) {
                        callbacks.onSwipeDown();
                    }
                }
            }
        }
    }

    /**
     * Initialize mobile bottom navigation
     */
    function initMobileNavigation() {
        if (!isMobileDevice()) return;

        // Check if bottom nav already exists
        if (document.getElementById('mobile-bottom-nav')) return;

        // Create bottom navigation
        const nav = document.createElement('nav');
        nav.id = 'mobile-bottom-nav';
        nav.className = 'mobile-bottom-nav';
        nav.innerHTML = `
            <a href="index.html" class="mobile-nav-item ${isCurrentPage('index.html') ? 'active' : ''}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Home</span>
            </a>
            <a href="vocabulary.html" class="mobile-nav-item ${isCurrentPage('vocabulary.html') ? 'active' : ''}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Words</span>
            </a>
            <a href="student-join.html" class="mobile-nav-item ${isCurrentPage('student-join.html') ? 'active' : ''}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Join</span>
            </a>
            <a href="worksheets.html" class="mobile-nav-item ${isCurrentPage('worksheets.html') ? 'active' : ''}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Print</span>
            </a>
        `;

        document.body.appendChild(nav);

        // Add padding to body to account for bottom nav
        document.body.style.paddingBottom = '80px';
    }

    /**
     * Check if current page matches
     */
    function isCurrentPage(page) {
        return window.location.pathname.endsWith(page) ||
               (page === 'index.html' && window.location.pathname === '/');
    }

    /**
     * Enable full-screen mode
     */
    function enterFullScreen() {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        }

        // Show toast
        if (typeof VocabLabUI !== 'undefined') {
            VocabLabUI.showToast('Full-screen mode enabled. Press ESC to exit.', 'info');
        }
    }

    /**
     * Exit full-screen mode
     */
    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
    }

    /**
     * Toggle full-screen mode
     */
    function toggleFullScreen() {
        if (!document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {
            enterFullScreen();
        } else {
            exitFullScreen();
        }
    }

    /**
     * Add full-screen button to game
     */
    function addFullScreenButton() {
        // Check if button already exists
        if (document.getElementById('fullscreen-btn')) return;

        const button = document.createElement('button');
        button.id = 'fullscreen-btn';
        button.className = 'fullscreen-btn';
        button.title = 'Toggle Full Screen';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
        `;
        button.onclick = toggleFullScreen;

        document.body.appendChild(button);

        // Update icon when fullscreen changes
        document.addEventListener('fullscreenchange', updateFullScreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullScreenIcon);
        document.addEventListener('msfullscreenchange', updateFullScreenIcon);

        function updateFullScreenIcon() {
            const isFullScreen = document.fullscreenElement ||
                                document.webkitFullscreenElement ||
                                document.msFullscreenElement;

            if (isFullScreen) {
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                    </svg>
                `;
            } else {
                button.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                    </svg>
                `;
            }
        }
    }

    /**
     * Optimize touch targets for mobile
     */
    function optimizeTouchTargets() {
        if (!isTouchDevice()) return;

        // Add touch-optimized class to body
        document.body.classList.add('touch-device');

        // Make all clickable elements larger on touch devices
        const minTouchSize = 44; // Apple's recommended minimum

        document.querySelectorAll('button, a, input[type="button"], input[type="submit"]').forEach(elem => {
            const rect = elem.getBoundingClientRect();
            if (rect.width < minTouchSize || rect.height < minTouchSize) {
                elem.classList.add('touch-optimized');
            }
        });
    }

    /**
     * Prevent zoom on double-tap (for games)
     */
    function preventDoubleTapZoom(element) {
        let lastTouchEnd = 0;
        element.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }

    /**
     * Initialize all utilities
     */
    function init() {
        initLazyLoading();
        initErrorHandling();
        initMobileNavigation();
        optimizeTouchTargets();
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        // Performance
        lazyLoadScript,
        deferCSS,
        initLazyLoading,

        // Error handling
        handleError,
        safeAsync,

        // Form validation
        validateForm,
        clearFormErrors,
        isValidEmail,

        // Mobile
        isMobileDevice,
        isTouchDevice,
        addSwipeGesture,
        initMobileNavigation,
        enterFullScreen,
        exitFullScreen,
        toggleFullScreen,
        addFullScreenButton,
        optimizeTouchTargets,
        preventDoubleTapZoom,

        // Init
        init
    };
})();
