import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type IAuthState = {
  token: string | null;
  user: any;
};

const initialState: IAuthState = {
  token: null,
  user: null,
};

export const signOut = createAsyncThunk("auth/signOut", async () => {});

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async () => {}
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
