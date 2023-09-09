// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "{your_firebase_config_key}",
  authDomain: "whatthefish-33992.firebaseapp.com",
  projectId: "whatthefish-33992",
  storageBucket: "whatthefish-33992.appspot.com",
    messagingSenderId: "364700410431",
  appId: "1:364700410431:web:88a0a22db6f08868418e8a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);