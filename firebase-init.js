// firebase-init.js
const firebaseConfig = {
    apiKey: "AIzaSyDVE5gYyGCgAlfHw82Apna6DsMY9zE2bGs",
    authDomain: "lovelybites-e4d35.firebaseapp.com",
    projectId: "lovelybites-e4d35",
    storageBucket: "lovelybites-e4d35.firebasestorage.app",
    messagingSenderId: "650974633550",
    appId: "1:650974633550:web:14e277c8aef5db9ff4ed1f"
};

// Firebase initialize karna
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}