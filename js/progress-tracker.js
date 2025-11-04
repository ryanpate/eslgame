/**
 * VocabLab Progress Tracker
 * Tracks student progress and saves to Firestore for teacher dashboards
 */

(function() {
    'use strict';

    // Progress tracker module
    window.VocabLabProgress = {

        /**
         * Check if student is logged in
         */
        isStudentLoggedIn: function() {
            const studentData = localStorage.getItem('vocablab_student');
            return !!studentData;
        },

        /**
         * Get current student data
         */
        getStudentData: function() {
            const studentData = localStorage.getItem('vocablab_student');
            if (!studentData) return null;

            try {
                return JSON.parse(studentData);
            } catch (e) {
                console.error('Error parsing student data:', e);
                return null;
            }
        },

        /**
         * Show student info banner at top of game
         */
        showStudentBanner: function() {
            const student = this.getStudentData();
            if (!student) return;

            // Check if banner already exists
            if (document.getElementById('student-banner')) return;

            const banner = document.createElement('div');
            banner.id = 'student-banner';
            banner.className = 'student-banner';
            banner.innerHTML = `
                <div class="student-banner-content">
                    <span class="student-name">👤 ${this.escapeHtml(student.name)}</span>
                    <span class="class-name">📚 ${this.escapeHtml(student.className)}</span>
                    <span class="tracking-badge">✓ Progress Tracked</span>
                </div>
                <button class="logout-student-btn" onclick="VocabLabProgress.logoutStudent()">
                    Switch Student
                </button>
            `;

            // Insert banner at top of body
            document.body.insertBefore(banner, document.body.firstChild);
        },

        /**
         * Save game result to Firestore
         */
        saveProgress: async function(gameData) {
            // Check if Firebase is configured
            if (typeof firebase === 'undefined' || !firebase.apps.length) {
                console.log('Firebase not configured, progress not saved');
                return false;
            }

            const student = this.getStudentData();
            if (!student) {
                console.log('No student logged in, progress not saved');
                return false;
            }

            try {
                const db = firebase.firestore();

                // Prepare progress data
                const progressData = {
                    studentId: student.id,
                    studentName: student.name,
                    classId: student.classId,
                    className: student.className,
                    teacherId: student.teacherId,
                    game: gameData.game || 'Unknown Game',
                    theme: gameData.theme || 'all',
                    difficulty: gameData.difficulty || 'all',
                    score: gameData.score || 0,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                // Add optional fields
                if (gameData.correctAnswers !== undefined) {
                    progressData.correctAnswers = gameData.correctAnswers;
                }
                if (gameData.totalQuestions !== undefined) {
                    progressData.totalQuestions = gameData.totalQuestions;
                }
                if (gameData.timeSpent !== undefined) {
                    progressData.timeSpent = gameData.timeSpent;
                }

                // Save to Firestore
                await db.collection('progress').add(progressData);

                console.log('Progress saved successfully');
                return true;

            } catch (error) {
                console.error('Error saving progress:', error);
                return false;
            }
        },

        /**
         * Logout student (switch student)
         */
        logoutStudent: function() {
            if (confirm('Switch student? Your progress has been saved.')) {
                localStorage.removeItem('vocablab_student');
                window.location.href = 'student-join.html';
            }
        },

        /**
         * Escape HTML to prevent XSS
         */
        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        /**
         * Get theme and difficulty from URL
         */
        getGameParams: function() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                theme: urlParams.get('theme') || 'all',
                difficulty: urlParams.get('difficulty') || 'all'
            };
        },

        /**
         * Initialize progress tracking on game page
         * Call this at the start of each game
         */
        init: function() {
            // Show student banner if logged in
            if (this.isStudentLoggedIn()) {
                this.showStudentBanner();
            }
        }
    };

    // Auto-initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.VocabLabProgress.init();
        });
    } else {
        window.VocabLabProgress.init();
    }

})();
