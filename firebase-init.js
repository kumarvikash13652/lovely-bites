// firebase-init.js
// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyDVE5gYyGCgAlfHw82Apna6DsMY9zE2bGs",
    authDomain: "lovelybites-e4d35.firebaseapp.com",
    projectId: "lovelybites-e4d35",
    storageBucket: "lovelybites-e4d35.firebasestorage.app",
    messagingSenderId: "650974633550",
    appId: "1:650974633550:web:14e277c8aef5db9ff4ed1f"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global helper configuration (Future use ke liye jaise Cashfree API keys)
const AppConfig = {
    cashfreeMode: "test", // 'test' ya 'production'
    // cashfreeAppId: "Aapki_Cashfree_App_ID_Yahan_Aayegi"
};
