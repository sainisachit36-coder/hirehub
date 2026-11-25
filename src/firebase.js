import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAatQn8sP3MgTpWuzVP1ZyJwQkOim9BSxc",
  authDomain: "hirehub-d90b3.firebaseapp.com",
  projectId: "hirehub-d90b3",
  storageBucket: "hirehub-d90b3.firebasestorage.app",
  messagingSenderId: "669103305216",
  appId: "1:669103305216:web:7d4c5d05559b182db49ee5",
  measurementId: "G-86NS3JMP8T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);