import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import userAnswerReducer from "./reducer/userAnswer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userAnswer: userAnswerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
