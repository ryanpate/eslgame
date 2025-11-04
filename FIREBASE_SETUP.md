# 🔥 Firebase Setup Guide for VocabLab Teacher Features

This guide will walk you through setting up Firebase for VocabLab's teacher authentication and class management system.

## 📋 Prerequisites

- Google account
- VocabLab codebase
- 10-15 minutes of setup time

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **"VocabLab"** (or your preferred name)
4. Click **Continue**
5. *Optional*: Enable Google Analytics (recommended for tracking usage)
6. Choose Analytics location (your country)
7. Click **Create project**
8. Wait for project creation (30-60 seconds)
9. Click **Continue** when ready

### Step 2: Register Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register app:
   - App nickname: **"VocabLab Web"**
   - ✅ Check **"Also set up Firebase Hosting"** (optional but recommended)
3. Click **Register app**
4. **IMPORTANT**: Copy the `firebaseConfig` object that appears
5. Click **Continue to console**

### Step 3: Configure Firebase in Your Code

1. Open `firebase-config.js` in your VocabLab directory
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",           // <- Replace this
    authDomain: "YOUR_PROJECT.firebaseapp.com",  // <- Replace this
    projectId: "YOUR_PROJECT_ID",             // <- Replace this
    storageBucket: "YOUR_PROJECT.appspot.com",   // <- Replace this
    messagingSenderId: "YOUR_SENDER_ID",      // <- Replace this
    appId: "YOUR_APP_ID"                      // <- Replace this
};
```

3. Save the file

### Step 4: Enable Authentication

1. In Firebase Console, click **Authentication** in the left sidebar
2. Click **Get started**
3. Click on **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Leave **Email link** OFF (we're using password)
7. Click **Save**

### Step 5: Set Up Firestore Database

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (we'll add rules next)
4. Choose your **Firestore location** (pick closest to your users):
   - `us-central1` for USA
   - `europe-west1` for Europe
   - `asia-northeast1` for Asia
5. Click **Enable**
6. Wait for database creation (30-60 seconds)

### Step 6: Configure Security Rules

1. Click on the **Rules** tab in Firestore
2. Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Teachers collection
    match /teachers/{teacherId} {
      // Teachers can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == teacherId;

      // Allow creation during signup
      allow create: if request.auth != null;
    }

    // Classes collection
    match /classes/{classId} {
      // Teachers can read/write classes they own
      allow read, write: if request.auth != null &&
        resource.data.teacherId == request.auth.uid;

      // Allow creation
      allow create: if request.auth != null;
    }

    // Students collection
    match /students/{studentId} {
      // Teachers can manage their students
      allow read, write: if request.auth != null;
    }

    // Progress tracking
    match /progress/{progressId} {
      // Teachers can view progress for their students
      allow read: if request.auth != null;

      // Students can write their own progress
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### Step 7: Test the Setup

1. Open your VocabLab site locally or on Netlify
2. Navigate to `teacher-signup.html`
3. Try creating a test teacher account
4. If successful, you should be redirected to the dashboard!

## ✅ Verification Checklist

Check that everything is working:

- [ ] Firebase project created
- [ ] Web app registered and config copied
- [ ] `firebase-config.js` updated with your credentials
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Test signup works
- [ ] Test login works
- [ ] Dashboard loads

## 🔧 Common Issues & Solutions

### Issue: "Firebase not configured" message
**Solution**: Make sure you replaced ALL values in `firebase-config.js`, not just some of them.

### Issue: "Email/password accounts are not enabled"
**Solution**: Go to Authentication > Sign-in method and enable Email/Password.

### Issue: "Missing or insufficient permissions"
**Solution**: Check that you published the security rules in Firestore.

### Issue: Login works but dashboard is empty
**Solution**: This is normal for a new account! Create a class to see data.

### Issue: "The file hasn't been read yet"
**Solution**: Make sure you saved `firebase-config.js` after editing it.

## 🆓 Firebase Free Tier Limits

Firebase Spark Plan (Free Forever):
- ✅ **Authentication**: 10,000 verifications/month
- ✅ **Firestore**:
  - 50,000 reads/day
  - 20,000 writes/day
  - 1 GB storage
- ✅ **Hosting**: 10 GB storage, 360 MB/day bandwidth

**This is more than enough for:**
- 100-200 teachers
- 1,000-2,000 students
- Thousands of games played daily

## 📊 Database Structure

VocabLab uses these collections:

### teachers
```javascript
{
  uid: "teacher123",
  firstName: "John",
  lastName: "Smith",
  email: "john@school.com",
  school: "Lincoln High",
  classIds: ["class1", "class2"],
  accountType: "free",
  createdAt: timestamp
}
```

### classes
```javascript
{
  id: "class1",
  name: "ESL Period 2",
  teacherId: "teacher123",
  classCode: "ABC123",
  studentCount: 25,
  theme: "daily-life",
  createdAt: timestamp
}
```

### students
```javascript
{
  id: "student1",
  name: "Maria Garcia",
  classId: "class1",
  classCode: "ABC123",
  teacherId: "teacher123",
  joinedAt: timestamp
}
```

### progress
```javascript
{
  id: "progress1",
  studentId: "student1",
  studentName: "Maria Garcia",
  classId: "class1",
  className: "ESL Period 2",
  teacherId: "teacher123",
  game: "Match Words",
  theme: "daily-life",
  difficulty: "easy",
  score: 85,
  timestamp: timestamp
}
```

## 🔐 Security Best Practices

1. **Never commit `firebase-config.js` with real credentials to public repos**
   - The config can be public (it's client-side), but be aware
   - API key restrictions can be added in Firebase Console

2. **Monitor usage in Firebase Console**
   - Check Usage tab regularly
   - Set up budget alerts

3. **Backup your data**
   - Export Firestore data regularly
   - Use Firebase's automated backups (paid feature)

## 🚀 Next Steps

Once Firebase is set up:

1. **Create teacher account** via signup page
2. **Build class management page** (coming next!)
3. **Add student join functionality**
4. **Implement progress tracking**
5. **Add export reports**

## 📞 Need Help?

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Support**: https://firebase.google.com/support
- **Community**: StackOverflow with `firebase` tag

## 🎉 You're All Set!

Firebase is now configured for VocabLab! Teachers can:
- ✅ Sign up
- ✅ Log in
- ✅ View dashboard
- 🔜 Manage classes (next phase)
- 🔜 Track students (next phase)

---

**Made with ❤️ for VocabLab Teachers**

Last updated: November 2025
