// Firebase Configuration for VocabLab
// TODO: Replace with your actual Firebase config after creating project

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (will be done in HTML pages)
// This file is a template - you'll need to create a Firebase project and add your credentials

/*
SETUP INSTRUCTIONS:

1. Go to https://console.firebase.google.com/
2. Click "Add project" or use existing project
3. Name it "VocabLab" (or your preferred name)
4. Enable Google Analytics (optional)
5. Go to Project Settings > General
6. Scroll to "Your apps" section
7. Click the Web icon (</>)
8. Register your app
9. Copy the firebaseConfig object
10. Replace the values above with your actual config
11. Go to Authentication > Sign-in method
12. Enable "Email/Password" provider
13. Go to Firestore Database
14. Click "Create database"
15. Start in "production mode"
16. Set location (choose closest to your users)

SECURITY RULES (Set in Firebase Console > Firestore > Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Teachers can read/write their own data
    match /teachers/{teacherId} {
      allow read, write: if request.auth != null && request.auth.uid == teacherId;
    }

    // Teachers can manage their classes
    match /classes/{classId} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/teachers/$(request.auth.uid)).data.classIds.hasAny([classId]);
    }

    // Teachers can manage their students
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }

    // Progress tracking
    match /progress/{progressId} {
      allow read, write: if request.auth != null;
    }
  }
}

*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
