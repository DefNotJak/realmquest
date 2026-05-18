import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCOGYYRYX6Z0IvTMvP_RdHeDp6WZKCk8Y",
  authDomain: "cecerealmquest.firebaseapp.com",
  projectId: "cecerealmquest",
  storageBucket: "cecerealmquest.firebasestorage.app",
  messagingSenderId: "851028333369",
  appId: "1:851028333369:web:e7a8b606f9ea75e16ecee8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
