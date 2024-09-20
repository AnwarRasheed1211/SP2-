// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore } from "firebase/firestore";



// Your web app's Firebase configuration
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
const storage = getStorage(app);  // Correct function name
const db = getFirestore(app)

export { storage };
export { db}
