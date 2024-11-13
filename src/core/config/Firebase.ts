// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClqkfd66s4Ayk3GOQnt6i6By7dQzXq-Yg",
  authDomain: "e-shopping-ddbbd.firebaseapp.com",
  projectId: "e-shopping-ddbbd",
  storageBucket: "e-shopping-ddbbd.firebasestorage.app",
  messagingSenderId: "226033903181",
  appId: "1:226033903181:web:c13e0de63f141615661e04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const facebookProvider = new FacebookAuthProvider();
export const googleProvider = new GoogleAuthProvider();
