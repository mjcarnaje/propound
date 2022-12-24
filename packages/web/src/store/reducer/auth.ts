import { createStandaloneToast } from "@chakra-ui/react";
import { ROLE, UserDocType } from "@propound/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { googleProvider } from "../../firebase/auth-provider";
import { userCollection } from "../../firebase/collections";
import { auth } from "../../firebase/config";
import { RootState } from "../store";

const { toast } = createStandaloneToast();

type IAuthState = {
  loading: boolean;
  token: string | null;
  user: UserDocType | null;
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

export const signInWithGoogle = createAsyncThunk<
  Omit<IAuthState, "loading">,
  ROLE
>("auth/signInWithGoogle", async (role): Promise<any> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userData = user.providerData[0];

    const userRef = doc(userCollection, user.uid);
    const userDoc = await getDoc(userRef);

    let userDataDoc: UserDocType | undefined = userDoc.data();

    if (!userDoc.exists()) {
      userDataDoc = {
        uid: user.uid,
        displayName: userData?.displayName || "",
        email: userData?.email || "",
        enrolledGames: [],
        photoURL: userData?.photoURL || "",
        createdGames: [],
        role,
      };
      await setDoc(userRef, userDataDoc);
    }

    if (userDataDoc?.role !== role) {
      toast({
        title: "You are not authorized to access this page",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return { token: null, user: null };
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
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<UserDocType>) => {
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
