import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASlfVCJmN_eeZFNSzTqU4MOnrOWHgiysk",
  authDomain: "chatschool-6585e.firebaseapp.com",
  databaseURL: "https://chatschool-6585e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatschool-6585e",
  storageBucket: "chatschool-6585e.appspot.com", // ✅ Correction ici
  messagingSenderId: "827308843030",
  appId: "1:827308843030:web:2525b97b720a3cd19e1537",
  measurementId: "G-DQ3QZ1339E"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // ✅ Ajout pour Firebase Database

export { analytics, database };
