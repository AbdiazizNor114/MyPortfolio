// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJyV3ItUrcVbNjPIgdB3itA_CVqzvXObA",
  authDomain: "student-performance-proj-9ba96.firebaseapp.com",
  projectId: "student-performance-proj-9ba96",
  storageBucket: "student-performance-proj-9ba96.firebasestorage.app",
  messagingSenderId: "362459010003",
  appId: "1:362459010003:web:d801b9fcbb1efe8f649526",
  measurementId: "G-54XKJJ101E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);