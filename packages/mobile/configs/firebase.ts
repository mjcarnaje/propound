// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXbjHQw_ail_zMIy1GXY2ObEPu-0_vWLw",
  authDomain: "propound-9e155.firebaseapp.com",
  projectId: "propound-9e155",
  storageBucket: "propound-9e155.appspot.com",
  messagingSenderId: "830929734929",
  appId: "1:830929734929:web:c8946d65949b94291b50b0",
  measurementId: "G-P4TMXJ0EMQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const authProviders = {
  google: new GoogleAuthProvider(),
};

export { firestore, auth, storage, authProviders };
