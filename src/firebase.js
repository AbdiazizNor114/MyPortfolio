import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuVmLDY8tycpjgeeaZl-YF7MztxEdLj5c",
  authDomain: "myportfolio-246aa.firebaseapp.com",
  projectId: "myportfolio-246aa",
  storageBucket: "myportfolio-246aa.firebasestorage.app",
  messagingSenderId: "1015483097363",
  appId: "1:1015483097363:web:fb8869815c0d66c50afae6",
  measurementId: "G-LH6VLZJYPD",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics only runs in the browser.
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;