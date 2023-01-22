import { ActivityDocType, UserDocType } from "@propound/types";
import { getAnalytics } from "firebase/analytics";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  getFirestore,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBXbjHQw_ail_zMIy1GXY2ObEPu-0_vWLw",
  authDomain: "propound-9e155.firebaseapp.com",
  projectId: "propound-9e155",
  storageBucket: "propound-9e155.appspot.com",
  messagingSenderId: "830929734929",
  appId: "1:830929734929:web:c8946d65949b94291b50b0",
  measurementId: "G-P4TMXJ0EMQ",
};

const app = initializeApp(firebaseConfig);

function getStorageWrapper() {
  try {
    return getStorage(app);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorageWrapper();
export const auth = getAuth(app);
export const collections = {
  activities: collection(
    firestore,
    "activities"
  ) as CollectionReference<ActivityDocType>,
  users: collection(firestore, "users") as CollectionReference<UserDocType>,
};
