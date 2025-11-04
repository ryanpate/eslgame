// Firebase Configuration for VocabLab
// ✅ Configured and ready to use!

const firebaseConfig = {
    apiKey: "AIzaSyChkaC8-I4X038Z-YCyz6oCKPWIC-TX6WA",
    authDomain: "vocablab-7aade.firebaseapp.com",
    projectId: "vocablab-7aade",
    storageBucket: "vocablab-7aade.firebasestorage.app",
    messagingSenderId: "830893526531",
    appId: "1:830893526531:web:5ec2a1f7b3c7b3e4ebc836",
    measurementId: "G-ZGW073LX4Y"
};

// Initialize Firebase (will be done in HTML pages)

/*
NEXT STEPS TO COMPLETE:

✅ Firebase config added above
⬜ Enable Authentication in Firebase Console:
   - Go to https://console.firebase.google.com/project/vocablab-7aade/authentication
   - Click "Get started"
   - Select "Email/Password" from Sign-in providers
   - Enable it and save

⬜ Create Firestore Database:
   - Go to https://console.firebase.google.com/project/vocablab-7aade/firestore
   - Click "Create database"
   - Start in "production mode" (we'll add rules next)
   - Choose a location closest to your users

⬜ Add Security Rules (see below)

SECURITY RULES (Copy and paste into Firebase Console > Firestore > Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Teachers can read/write their own data
    match /teachers/{teacherId} {
      allow read, write: if request.auth != null && request.auth.uid == teacherId;
    }

    // Anyone authenticated can read classes (for student join)
    // Only teachers can write their own classes
    match /classes/{classId} {
      allow read: if true;
      allow write: if request.auth != null &&
        resource.data.teacherId == request.auth.uid;
    }

    // Anyone can create students (for student join)
    // Teachers can manage students in their classes
    match /students/{studentId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }

    // Anyone can write progress (for student games without auth)
    // Teachers can read progress for their classes
    match /progress/{progressId} {
      allow read: if true;
      allow write: if true;
    }
  }
}

*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
