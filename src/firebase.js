// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2ACY7ivRcopqedbhXTbW2ijbVNptcvWQ",
  authDomain: "bookmyevent-piross.firebaseapp.com",
  projectId: "bookmyevent-piross",
  storageBucket: "bookmyevent-piross.appspot.com",
  messagingSenderId: "697272212013",
  appId: "1:697272212013:web:352a2ccb633b1ebdc5f6a4",
  measurementId: "G-JCC00C4170"
};

// Initialization
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { storage };
