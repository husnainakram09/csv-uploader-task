// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCszd1FwDFiTpC6D41RHVEM9SUZX3hDsqE",
  authDomain: "zysoft-task.firebaseapp.com",
  projectId: "zysoft-task",
  storageBucket: "zysoft-task.appspot.com",
  messagingSenderId: "161187237907",
  appId: "1:161187237907:web:7cb69797c9e716872b6fe6",
  measurementId: "G-NS9YJ8LP3W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { database, firestore };
