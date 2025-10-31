from flask import Flask, render_template, jsonify, request, session
import random
import os
from pathlib import Path

# Get the directory where app.py is located
BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__, 
            template_folder=str(BASE_DIR / 'templates'),
            static_folder=str(BASE_DIR / 'static'))
app.secret_key = os.urandom(24)

# Halloween vocabulary with definitions and hints
HALLOWEEN_WORDS = {
    'ghost': {
        'definition': 'A spirit of a dead person',
        'hint': 'A white floating spirit that says "Boo!"',
        'emoji': '👻',
        'difficulty': 'easy'
    },
    'witch': {
        'definition': 'A woman with magical powers',
        'hint': 'Flies on a broomstick and wears a pointy hat',
        'emoji': '🧙‍♀️',
        'difficulty': 'easy'
    },
    'pumpkin': {
        'definition': 'A large orange vegetable',
        'hint': 'Orange and round, carved for Halloween',
        'emoji': '🎃',
        'difficulty': 'easy'
    },
    'candy': {
        'definition': 'Sweet food, often chocolate',
        'hint': 'Sweet treats you get on Halloween',
        'emoji': '🍬',
        'difficulty': 'easy'
    },
    'skeleton': {
        'definition': 'The bones of a body',
        'hint': 'All the bones in your body',
        'emoji': '💀',
        'difficulty': 'medium'
    },
    'vampire': {
        'definition': 'A creature that drinks blood',
        'hint': 'Has fangs and fears sunlight',
        'emoji': '🧛',
        'difficulty': 'medium'
    },
    'costume': {
        'definition': 'Special clothes you wear to look like someone else',
        'hint': 'Special outfit you wear on Halloween',
        'emoji': '🎭',
        'difficulty': 'medium'
    },
    'spider': {
        'definition': 'A small creature with eight legs',
        'hint': 'Has eight legs and makes webs',
        'emoji': '🕷️',
        'difficulty': 'easy'
    },
    'bat': {
        'definition': 'A flying mammal active at night',
        'hint': 'Flies at night and hangs upside down',
        'emoji': '🦇',
        'difficulty': 'easy'
    },
    'haunted': {
        'definition': 'A place where ghosts live',
        'hint': 'A scary place with ghosts',
        'emoji': '🏚️',
        'difficulty': 'medium'
    },
    'monster': {
        'definition': 'A scary imaginary creature',
        'hint': 'A scary creature from stories',
        'emoji': '👹',
        'difficulty': 'easy'
    },
    'cauldron': {
        'definition': 'A large pot for cooking',
        'hint': 'A big pot where witches make potions',
        'emoji': '🍯',
        'difficulty': 'hard'
    },
    'werewolf': {
        'definition': 'A person who turns into a wolf',
        'hint': 'A person who becomes a wolf at full moon',
        'emoji': '🐺',
        'difficulty': 'hard'
    },
    'mummy': {
        'definition': 'A dead body wrapped in cloth',
        'hint': 'An Egyptian body wrapped in bandages',
        'emoji': '🧟',
        'difficulty': 'medium'
    },
    'potion': {
        'definition': 'A magical liquid drink',
        'hint': 'A magic drink made by witches',
        'emoji': '🧪',
        'difficulty': 'medium'
    },
    'cobweb': {
        'definition': 'An old spider web',
        'hint': 'An old spider web in corners',
        'emoji': '🕸️',
        'difficulty': 'hard'
    },
    'graveyard': {
        'definition': 'A place where dead people are buried',
        'hint': 'A place with tombstones and graves',
        'emoji': '⚰️',
        'difficulty': 'hard'
    },
    'broomstick': {
        'definition': 'A cleaning tool that witches fly on',
        'hint': 'What a witch uses to fly',
        'emoji': '🧹',
        'difficulty': 'medium'
    },
    'scary': {
        'definition': 'Something that makes you afraid',
        'hint': 'Makes you feel frightened',
        'emoji': '😱',
        'difficulty': 'easy'
    },
    'spooky': {
        'definition': 'Strange and frightening',
        'hint': 'A little bit scary and strange',
        'emoji': '👻',
        'difficulty': 'medium'
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game/matching')
def matching_game():
    # Get difficulty level
    difficulty = request.args.get('difficulty', 'all')
    
    # Filter words by difficulty
    if difficulty != 'all':
        words = {k: v for k, v in HALLOWEEN_WORDS.items() if v['difficulty'] == difficulty}
    else:
        words = HALLOWEEN_WORDS
    
    # Select 6 random words
    selected = random.sample(list(words.keys()), min(6, len(words)))
    game_data = {word: HALLOWEEN_WORDS[word] for word in selected}
    
    # Shuffle definitions separately
    shuffled_definitions = random.sample(list(game_data.keys()), len(game_data))
    
    return render_template('matching.html', words=game_data, shuffled_defs=shuffled_definitions, difficulty=difficulty)

@app.route('/game/spelling')
def spelling_game():
    difficulty = request.args.get('difficulty', 'all')
    
    if difficulty != 'all':
        words = {k: v for k, v in HALLOWEEN_WORDS.items() if v['difficulty'] == difficulty}
    else:
        words = HALLOWEEN_WORDS
    
    return render_template('spelling.html', words=words, difficulty=difficulty)

@app.route('/game/scramble')
def scramble_game():
    difficulty = request.args.get('difficulty', 'all')
    
    if difficulty != 'all':
        words = {k: v for k, v in HALLOWEEN_WORDS.items() if v['difficulty'] == difficulty}
    else:
        words = HALLOWEEN_WORDS
    
    return render_template('scramble.html', words=words, difficulty=difficulty)

@app.route('/api/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    word = data.get('word', '').lower()
    answer = data.get('answer', '').lower()
    
    is_correct = word == answer
    
    response = {
        'correct': is_correct,
        'word': word
    }
    
    if word in HALLOWEEN_WORDS:
        response['definition'] = HALLOWEEN_WORDS[word]['definition']
        response['emoji'] = HALLOWEEN_WORDS[word]['emoji']
    
    return jsonify(response)

@app.route('/vocabulary')
def vocabulary_list():
    return render_template('vocabulary.html', words=HALLOWEEN_WORDS)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting app on port {port}")
    print(f"Template folder: {app.template_folder}")
    print(f"Static folder: {app.static_folder}")
    app.run(debug=False, host='0.0.0.0', port=port)
