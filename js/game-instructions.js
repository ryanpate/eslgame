/**
 * Game Instructions and Help Content
 * Contains objectives, instructions, and tips for each game
 */

const GAME_INSTRUCTIONS = {
    'matching': {
        name: 'Match Words',
        objective: 'Match vocabulary words with their correct definitions by creating pairs.',
        instructions: [
            'Click on a word card, then click on its matching definition card',
            'If the cards match, they will stay flipped',
            'If they don\'t match, they will flip back over',
            'Continue until all pairs are matched',
            'Try to complete the game with the fewest attempts possible'
        ],
        tips: [
            'Read the definitions carefully before making matches',
            'Try to remember where cards are located',
            'Start by matching words you\'re most confident about',
            'Use the hint feature if you get stuck'
        ]
    },

    'spelling': {
        name: 'Spell It!',
        objective: 'Type the correct spelling of vocabulary words based on their definitions.',
        instructions: [
            'Read the definition and look at the emoji hint',
            'Type the correct spelling of the word',
            'Click "Check" or press Enter to submit your answer',
            'Correct spellings turn green, incorrect ones turn red',
            'Move through all words to complete the game'
        ],
        tips: [
            'Pay attention to double letters and silent letters',
            'Use the hint if you\'re unsure',
            'Take your time - accuracy is more important than speed',
            'Try saying the word out loud to help with spelling'
        ]
    },

    'scramble': {
        name: 'Word Scramble',
        objective: 'Unscramble mixed-up letters to form the correct vocabulary word.',
        instructions: [
            'Look at the scrambled letters',
            'Read the definition and emoji hint',
            'Type the unscrambled word',
            'Submit your answer to check if it\'s correct',
            'Continue until all words are unscrambled'
        ],
        tips: [
            'Look for common letter combinations (th, ch, ing, etc.)',
            'Try rearranging vowels and consonants',
            'Think about words that match the definition',
            'Use the hint if you\'re stuck'
        ]
    },

    'flashcard': {
        name: 'Flashcard Quiz',
        objective: 'Select the correct word that matches the given definition.',
        instructions: [
            'Read the definition carefully',
            'Look at the emoji hint for additional context',
            'Choose the correct word from the four options',
            'Click your answer to check if it\'s correct',
            'Continue through all flashcards to complete the quiz'
        ],
        tips: [
            'Eliminate options you know are wrong',
            'Use the emoji as a visual clue',
            'Think about the context of the definition',
            'Take your time to read all options'
        ]
    },

    'speed': {
        name: 'Speed Challenge',
        objective: 'Answer as many questions as possible before time runs out.',
        instructions: [
            'Click "Start Challenge" to begin the 60-second timer',
            'Read each definition quickly',
            'Select the matching word from four choices',
            'Answer correctly to earn points',
            'Continue answering until time runs out'
        ],
        tips: [
            'Answer quickly but carefully',
            'Skip difficult questions and come back if time permits',
            'Practice with other games first to learn the vocabulary',
            'Check the leaderboard to see top scores'
        ]
    },

    'conversation': {
        name: 'Conversation Builder',
        objective: 'Complete sentences by choosing the correct vocabulary word.',
        instructions: [
            'Read the sentence with the blank space',
            'Look at the four word choices',
            'Select the word that best completes the sentence',
            'Correct answers help you build natural-sounding sentences',
            'Continue through all sentences'
        ],
        tips: [
            'Read the entire sentence before choosing',
            'Think about which word makes the most sense in context',
            'Consider grammar and sentence structure',
            'The emoji hints can help guide your choice'
        ]
    },

    'category-sort': {
        name: 'Category Sort',
        objective: 'Drag and drop words into the correct difficulty categories.',
        instructions: [
            'Look at the words in the pool at the bottom',
            'Drag each word to the category where it belongs',
            'Categories are: Easy, Medium, and Hard',
            'Click "Check Answers" when all words are sorted',
            'Correct placements turn green, incorrect ones turn red'
        ],
        tips: [
            'Think about how common or complex each word is',
            'Easy words are usually simple and frequently used',
            'Hard words are more advanced and specialized',
            'Use the hint button if you need help with a specific word'
        ]
    }
};

/**
 * Add "How to Play" button to a game page
 * @param {string} gameKey - The game identifier (e.g., 'matching', 'spelling')
 */
function addHowToPlayButton(gameKey) {
    const gameInfo = GAME_INSTRUCTIONS[gameKey];
    if (!gameInfo) {
        console.warn(`No instructions found for game: ${gameKey}`);
        return;
    }

    // Create help button
    const helpBtn = document.createElement('button');
    helpBtn.className = 'game-help-btn';
    helpBtn.innerHTML = '?';
    helpBtn.title = 'How to Play';
    helpBtn.onclick = function() {
        if (typeof VocabLabUI !== 'undefined') {
            VocabLabUI.showHowToPlay(gameInfo);
        }
    };

    document.body.appendChild(helpBtn);
}

/**
 * Show quick tips during gameplay
 * @param {string} gameKey - The game identifier
 * @param {number} tipIndex - Which tip to show (0-based)
 */
function showGameTip(gameKey, tipIndex = 0) {
    const gameInfo = GAME_INSTRUCTIONS[gameKey];
    if (!gameInfo || !gameInfo.tips || !gameInfo.tips[tipIndex]) {
        return;
    }

    if (typeof VocabLabUI !== 'undefined') {
        VocabLabUI.showQuickTip(gameInfo.tips[tipIndex]);
    }
}

/**
 * Auto-show tip after certain game events
 * @param {string} gameKey - The game identifier
 * @param {string} eventType - Type of event: 'start', 'stuck', 'halfway', 'almost-done'
 */
function showContextualTip(gameKey, eventType) {
    const gameInfo = GAME_INSTRUCTIONS[gameKey];
    if (!gameInfo || !gameInfo.tips) return;

    let tipIndex;
    switch(eventType) {
        case 'start':
            tipIndex = 0; // Show first tip on start
            break;
        case 'stuck':
            tipIndex = 3; // Show hint-related tip
            break;
        case 'halfway':
            tipIndex = 1; // Show second tip
            break;
        case 'almost-done':
            tipIndex = 2; // Show third tip
            break;
        default:
            return;
    }

    if (gameInfo.tips[tipIndex] && typeof VocabLabUI !== 'undefined') {
        VocabLabUI.showQuickTip(gameInfo.tips[tipIndex]);
    }
}
