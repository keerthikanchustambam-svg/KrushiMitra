import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB5sOpnzhUP8FBVs6pHbEbgYAEIDy6YdRw",
    authDomain: "krushimitra-44088.firebaseapp.com",
    projectId: "krushimitra-44088",
    storageBucket: "krushimitra-44088.firebasestorage.app",
    messagingSenderId: "430417560570",
    appId: "1:430417560570:web:238e91a049c64783be1a43",
    measurementId: "G-PDM3MH3TMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;
