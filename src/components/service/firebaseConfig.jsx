// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4UbA1Fpokz90E8ClQ970_6MzAo_Q6YL4",
  authDomain: "journeyforge-805a3.firebaseapp.com",
  projectId: "journeyforge-805a3",
  storageBucket: "journeyforge-805a3.firebasestorage.app",
  messagingSenderId: "788669137236",
  appId: "1:788669137236:web:c0c7033de99a4098f948c1",
  measurementId: "G-T8ZN4RS8W5"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);