// Halloween Vocabulary Data
const HALLOWEEN_WORDS = {
    'ghost': {
        definition: 'A spirit of a dead person',
        hint: 'A white floating spirit that says "Boo!"',
        emoji: '👻',
        difficulty: 'easy'
    },
    'witch': {
        definition: 'A woman with magical powers',
        hint: 'Flies on a broomstick and wears a pointy hat',
        emoji: '🧙‍♀️',
        difficulty: 'easy'
    },
    'pumpkin': {
        definition: 'A large orange vegetable',
        hint: 'Orange and round, carved for Halloween',
        emoji: '🎃',
        difficulty: 'easy'
    },
    'candy': {
        definition: 'Sweet food, often chocolate',
        hint: 'Sweet treats you get on Halloween',
        emoji: '🍬',
        difficulty: 'easy'
    },
    'skeleton': {
        definition: 'The bones of a body',
        hint: 'All the bones in your body',
        emoji: '💀',
        difficulty: 'medium'
    },
    'vampire': {
        definition: 'A creature that drinks blood',
        hint: 'Has fangs and fears sunlight',
        emoji: '🧛',
        difficulty: 'medium'
    },
    'costume': {
        definition: 'Special clothes you wear to look like someone else',
        hint: 'Special outfit you wear on Halloween',
        emoji: '🎭',
        difficulty: 'medium'
    },
    'spider': {
        definition: 'A small creature with eight legs',
        hint: 'Has eight legs and makes webs',
        emoji: '🕷️',
        difficulty: 'easy'
    },
    'bat': {
        definition: 'A flying mammal active at night',
        hint: 'Flies at night and hangs upside down',
        emoji: '🦇',
        difficulty: 'easy'
    },
    'haunted': {
        definition: 'A place where ghosts live',
        hint: 'A scary place with ghosts',
        emoji: '🏚️',
        difficulty: 'medium'
    },
    'monster': {
        definition: 'A scary imaginary creature',
        hint: 'A scary creature from stories',
        emoji: '👹',
        difficulty: 'easy'
    },
    'cauldron': {
        definition: 'A large pot for cooking',
        hint: 'A big pot where witches make potions',
        emoji: '🍯',
        difficulty: 'hard'
    },
    'werewolf': {
        definition: 'A person who turns into a wolf',
        hint: 'A person who becomes a wolf at full moon',
        emoji: '🐺',
        difficulty: 'hard'
    },
    'mummy': {
        definition: 'A dead body wrapped in cloth',
        hint: 'An Egyptian body wrapped in bandages',
        emoji: '🧟',
        difficulty: 'medium'
    },
    'potion': {
        definition: 'A magical liquid drink',
        hint: 'A magic drink made by witches',
        emoji: '🧪',
        difficulty: 'medium'
    },
    'cobweb': {
        definition: 'An old spider web',
        hint: 'An old spider web in corners',
        emoji: '🕸️',
        difficulty: 'hard'
    },
    'graveyard': {
        definition: 'A place where dead people are buried',
        hint: 'A place with tombstones and graves',
        emoji: '⚰️',
        difficulty: 'hard'
    },
    'broomstick': {
        definition: 'A cleaning tool that witches fly on',
        hint: 'What a witch uses to fly',
        emoji: '🧹',
        difficulty: 'medium'
    },
    'scary': {
        definition: 'Something that makes you afraid',
        hint: 'Makes you feel frightened',
        emoji: '😱',
        difficulty: 'easy'
    },
    'spooky': {
        definition: 'Strange and frightening',
        hint: 'A little bit scary and strange',
        emoji: '👻',
        difficulty: 'medium'
    }
};

// Utility functions
function getWordsByDifficulty(difficulty) {
    if (difficulty === 'all') {
        return HALLOWEEN_WORDS;
    }
    const filtered = {};
    for (const [word, data] of Object.entries(HALLOWEEN_WORDS)) {
        if (data.difficulty === difficulty) {
            filtered[word] = data;
        }
    }
    return filtered;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomWords(words, count) {
    const wordList = Object.keys(words);
    const shuffled = shuffleArray(wordList);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get difficulty from URL parameters
function getDifficultyFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('difficulty') || 'all';
}

// Save and load progress
function saveProgress(gameType, score) {
    const key = `halloween_vocab_${gameType}`;
    const data = {
        score: score,
        date: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(data));
}

function loadProgress(gameType) {
    const key = `halloween_vocab_${gameType}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
