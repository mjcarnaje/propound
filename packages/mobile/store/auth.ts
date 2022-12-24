import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithCredential,
} from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import create from "zustand";
import { auth, firestore } from "../configs/firebase";
import { UserDocType } from "@propound/types";

interface AuthState {
  user: UserDocType | null;
  loading: boolean;
  setUser: (user: UserDocType | null) => void;
  setLoading: (loading: boolean) => void;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  setEnrolledGames: (e: string[]) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: false,
  token: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setEnrolledGames: (enrolledGames) => {
    if (get().user) {
      set((state) => ({
        user: {
          ...state.user,
          enrolledGames,
        },
      }));
    }
  },
  signInWithGoogle: async (idToken) => {
    try {
      set({ loading: true });

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);

      const user = result.user;
      const userData = user.providerData[0];

      const userRef = doc(
        collection(firestore, "user") as CollectionReference<UserDocType>,
        user.uid
      );
      const userDoc = await getDoc(userRef);

      let userDataDoc: UserDocType = userDoc.data();

      if (!userDoc.exists()) {
        userDataDoc = {
          uid: user.uid,
          displayName: userData?.displayName || "",
          email: userData?.email || "",
          enrolledGames: [],
          photoURL: userData?.photoURL || "",
          createdGames: [],
          role: "STUDENT",
        };
        await setDoc(userRef, userDataDoc);
      }

      if (userDataDoc.role == "TEACHER") {
        console.log("You are a teacher!");
        return;
      }

      console.log("You are a student!", { userDataDoc });

      set({ loading: false, user: userDataDoc });
    } catch (err) {
      console.error(err);
    }
  },
  signInAnonymously: async () => {
    try {
      set({ loading: true });

      const result = await signInAnonymously(auth);

      const user = result.user;

      const userRef = doc(
        collection(firestore, "user") as CollectionReference<UserDocType>,
        user.uid
      );
      const userDoc = await getDoc(userRef);

      let userDataDoc: UserDocType = userDoc.data();

      if (!userDoc.exists()) {
        userDataDoc = {
          uid: user.uid,
          displayName: "Anonymous",
          email: "",
          enrolledGames: [],
          photoURL: "",
          createdGames: [],
          role: "STUDENT",
        };
        await setDoc(userRef, userDataDoc);
      }

      console.log("You are a student!", { userDataDoc });

      set({ loading: false, user: userDataDoc });
    } catch (err) {
      console.error(err);
    }
  },
}));
