import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBt6MmNYqLdb2IiPLFR6hS_dSzl4bwMjx0",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "draft2-1742d.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://draft2-1742d-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "draft2-1742d",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "draft2-1742d.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "app-id",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { 
  db, 
  storage, 
  ref, 
  set, 
  onValue, 
  update, 
  get,
  storageRef, 
  uploadBytes, 
  getDownloadURL 
};