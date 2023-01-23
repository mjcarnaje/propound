import { createStandaloneToast } from "@chakra-ui/react";
import {
  AdminDocType,
  AuthoredDocType,
  Role,
  TeacherDocType,
  UserDocType,
} from "@propound/types";
import { isStudentDocType } from "@propound/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { googleProvider } from "../../firebase/auth-provider";
import { auth, collections } from "../../firebase/config";
import { RootState } from "../store";

const { toast } = createStandaloneToast();

type IAuthState = {
  loading: boolean;
  token: string | null;
  user: AuthoredDocType | null;
};

const initialState: IAuthState = {
  loading: true,
  token: null,
  user: null,
};

export const signOut = createAsyncThunk("auth/signOut", async () => {
  try {
    await auth.signOut();
  } catch (err) {
    console.error(err);
  }
});

const ADMIN_EMAILS = [
  "propound2022@gmail.com",
  "propound2023@gmail.com",
  "michaeljamescarnaje1@gmail.com",
];

export const signInWithGoogle = createAsyncThunk<Omit<IAuthState, "loading">>(
  "auth/signInWithGoogle",
  async (): Promise<any> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = user.providerData[0];

      if (!userData.email) {
        toast({
          title: "Error signing in with Google",
          description: "No user found",
          status: "error",
        });
        return;
      }

      const isAdminEmail = ADMIN_EMAILS.indexOf(userData.email) !== -1;

      if (!userData.email.includes("@g.msuiit.edu.ph") && !isAdminEmail) {
        toast({
          title: "Error signing in with Google",
          description: "You must use your MSU-IIT email",
          status: "error",
        });
        return;
      }

      const userRef = doc(collections.users, user.uid);
      const userDoc = await getDoc(userRef);

      let userDataDoc: UserDocType | undefined = userDoc.data();

      function createTeacherDoc(): TeacherDocType {
        return {
          uid: user.uid,
          createdGames: [],
          email: userData.email || "",
          firstName: userData.displayName || "",
          lastName: "",
          photoURL: userData.photoURL || "",
          role: Role.Teacher,
        };
      }

      function createAdminDoc(): AdminDocType {
        return {
          uid: user.uid,
          createdGames: [],
          email: userData.email || "",
          firstName: "Admin",
          lastName: "",
          photoURL: userData.photoURL || "",
          role: Role.Admin,
        };
      }

      if (!userDoc.exists()) {
        if (isAdminEmail) {
          userDataDoc = createAdminDoc();
        } else {
          userDataDoc = createTeacherDoc();
        }
        await setDoc(userRef, userDataDoc);
      }

      if (userDataDoc && isStudentDocType(userDataDoc)) {
        toast({
          title: "Error signing in with Google",
          description: "You are not authorized to login",
          status: "error",
        });
        return;
      }

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      return { token, user: userDataDoc };
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error signing in with Google",
        description: err.message,
        status: "error",
        duration: 5000,
      });
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<AuthoredDocType>) => {
      state.user = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signInWithGoogle.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.token = payload.token;
      state.user = payload.user;
    });
    builder.addCase(signInWithGoogle.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.token = null;
      state.user = null;
    });
  },
});

export const { setUser, setLoading } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
