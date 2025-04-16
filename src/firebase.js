import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
    apiKey: "AIzaSyCiiHFUtxQgErPm0jYn2F1Sad10OrQqMWU",
    authDomain: "stayease03.firebaseapp.com",
    projectId: "stayease03",
    storageBucket: "stayease03.firebasestorage.app",
    messagingSenderId: "607381617137",
    appId: "1:607381617137:web:1c0ffb3b83f6fb2876ec50",
    measurementId: "G-BP5X3873RY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 