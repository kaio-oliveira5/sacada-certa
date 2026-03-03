import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC5Lq2dcvkhelnCqZ_w-821N1UK3Gf5I70",
    authDomain: "sacada-certa.firebaseapp.com",
    projectId: "sacada-certa",
    storageBucket: "sacada-certa.firebasestorage.app",
    messagingSenderId: "179835825360",
    appId: "1:179835825360:web:e0218701e8319dab3c02d5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);