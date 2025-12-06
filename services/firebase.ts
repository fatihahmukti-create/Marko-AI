import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAf8EFRiyQKZAcUsDKhvVqoRx347klth4w",
  authDomain: "marko-ai-4fd1e.firebaseapp.com",
  projectId: "marko-ai-4fd1e",
  storageBucket: "marko-ai-4fd1e.firebasestorage.app",
  messagingSenderId: "198333042422",
  appId: "1:198333042422:web:c104216d6f799961b566d7",
  measurementId: "G-XB4WBFPCXG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
