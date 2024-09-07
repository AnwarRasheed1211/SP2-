// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getstorage } from "@firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByf9igT-aaiJ_we2uF9Fmm4wKtCjfviGg",
  authDomain: "camels-cafe-and-restaurant-pic.firebaseapp.com",
  projectId: "camels-cafe-and-restaurant-pic",
  storageBucket: "camels-cafe-and-restaurant-pic.appspot.com",
  messagingSenderId: "894977645036",
  appId: "1:894977645036:web:5c53ba5b8acee97c2008c9",
  measurementId: "G-HJW6725N13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getstorage(app);
export const db = getFirestore(app)
