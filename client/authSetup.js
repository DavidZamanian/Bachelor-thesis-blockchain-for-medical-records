// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT5G4byurxGZYa8Mrv0euwHANFpDgew6Y",
  authDomain: "blockchain-for-medical-records.firebaseapp.com",
  projectId: "blockchain-for-medical-records",
  storageBucket: "blockchain-for-medical-records.appspot.com",
  messagingSenderId: "87615118642",
  appId: "1:87615118642:web:a2c5837414566674638b2b",
  measurementId: "G-GPGBNN21J7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
