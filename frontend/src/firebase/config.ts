import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAS8-ySohNT2qOSXnfciuHkDEnFhvyyb2g",
  authDomain: "operation-theta.firebaseapp.com",
  projectId: "operation-theta",
  storageBucket: "operation-theta.firebasestorage.app",
  messagingSenderId: "47673614142",
  appId: "1:47673614142:web:4a61518024ec98d4a8966f",
};

// Prevent multiple initializations
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
