
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAf8EFRiyQKZAcUsDKhvVqoRx347klth4w",
  authDomain: "marko-ai-4fd1e.firebaseapp.com",
  projectId: "marko-ai-4fd1e",
  storageBucket: "marko-ai-4fd1e.firebasestorage.app",
  messagingSenderId: "198333042422",
  appId: "1:198333042422:web:c104216d6f799961b566d7",
  measurementId: "G-XB4WBFPCXG"
};

// Initialize Firebase (compat/namespace style)
const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

export const auth = app.auth();
export const storage = app.storage();
export const analytics = app.analytics();
export default app;
