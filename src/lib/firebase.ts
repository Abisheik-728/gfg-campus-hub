import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyDyW-y719udm95cy-UvwP_ZBa3PibER84w",
  authDomain:        "gfg-campus-hub.firebaseapp.com",
  projectId:         "gfg-campus-hub",
  storageBucket:     "gfg-campus-hub.firebasestorage.app",
  messagingSenderId: "824955005922",
  appId:             "1:824955005922:web:be867b63061bfb604927bb",
  measurementId:     "G-MDLS07FTTJ",
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
