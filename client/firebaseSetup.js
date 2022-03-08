import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getDatabase, ref, onValue} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCT5G4byurxGZYa8Mrv0euwHANFpDgew6Y",
  authDomain: "blockchain-for-medical-records.firebaseapp.com",
  projectId: "blockchain-for-medical-records",
  storageBucket: "blockchain-for-medical-records.appspot.com",
  messagingSenderId: "87615118642",
  appId: "1:87615118642:web:a2c5837414566674638b2b",
  measurementId: "G-GPGBNN21J7",
  databaseURL:"https://blockchain-for-medical-records-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, ref, onValue };
