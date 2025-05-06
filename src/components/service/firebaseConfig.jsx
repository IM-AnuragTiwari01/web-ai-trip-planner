// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbpXESoehoo79AGYxzZMIs6pAvVubK10g",
  authDomain: "ai-trip-planner-2d9c2.firebaseapp.com",
  projectId: "ai-trip-planner-2d9c2",
  storageBucket: "ai-trip-planner-2d9c2.firebasestorage.app",
  messagingSenderId: "941407678930",
  appId: "1:941407678930:web:873b1e19e5c0c21be7980b",
  measurementId: "G-0YHVLCS3GY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);