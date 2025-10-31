# 🎃 Quick Start Guide for Teachers

## What is this?
A Halloween-themed vocabulary game to help ESL students learn English words in a fun way!

## 🚀 5-Minute Setup

### Option 1: Railway (Easiest - Recommended)

1. Go to [railway.app](https://railway.app) and sign up (free)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Upload this folder as a new repository
6. Select the repository
7. Railway automatically deploys!
8. Get your URL and share with students

**That's it!** Your game is live in minutes.

### Option 2: Run Locally (For Testing)

```bash
# Install Python 3.8 or higher first
pip install -r requirements.txt
python app.py
```

Open: `http://localhost:5000`

## 📚 How Students Use It

1. **Student opens the URL** (no login needed!)
2. **Choose difficulty**: Easy, Medium, or Hard
3. **Pick a game**:
   - 🎯 Match Words - Connect words to meanings
   - ✍️ Spell It! - Type the correct spelling
   - 🔀 Word Scramble - Unscramble letters
4. **Learn!** Get instant feedback and scores

## 🎯 Best Practices

### In Class
- Start with the **Vocabulary List** page
- Let students study words for 5 minutes
- Then play games as a fun activity
- Use **Easy** mode for beginners

### For Homework
- Assign specific game modes
- Ask students to play each game once
- Have them write sentences with 5 words they learned

### For Different Levels
- **Beginners**: Easy mode + Match Words game
- **Intermediate**: Medium mode + all games
- **Advanced**: Hard mode + Spelling game

## 🎨 Customizing Vocabulary

Want to add your own words? Edit `app.py`:

```python
HALLOWEEN_WORDS = {
    'ghost': {
        'definition': 'A spirit of a dead person',
        'hint': 'A white floating spirit that says "Boo!"',
        'emoji': '👻',
        'difficulty': 'easy'
    },
    # Add more words here!
}
```

## 📱 Works On

- ✅ Computers
- ✅ Tablets  
- ✅ Phones
- ✅ Chromebooks
- ✅ Any web browser

## 🆘 Troubleshooting

**Game not loading?**
- Check internet connection
- Try different browser
- Clear browser cache

**Want to add words?**
- Edit app.py file
- Follow the format above
- Redeploy

**Students having trouble?**
- Start with Easy difficulty
- Use Vocabulary List first
- Encourage using hints (💡 button)

## 🎓 Learning Goals

This game helps students:
- ✅ Build vocabulary
- ✅ Practice spelling
- ✅ Learn definitions
- ✅ Have fun while learning!

## 💡 Pro Tips

1. **Project on screen**: Play as a class activity
2. **Competition**: Who gets the highest score?
3. **Vocabulary notebooks**: Students write down new words
4. **Progress tracking**: Take screenshots of final scores
5. **Reward system**: High scores = stickers/points

## 📞 Need Help?

- Check the main README.md file
- Deployment platforms have great support docs
- Most issues are solved by redeploying

---

**Have fun teaching! 🎃👻**
