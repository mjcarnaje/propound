import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameDocTemplate } from "../../types/game";
import { MatchUpItem, MatchUpItemType } from "../../types/match-up";
import { RootState } from "../store";

export type GameShowAnswerType = Record<string, string | null>;
export type MatchUpAnswerType = (MatchUpItemType & {
  answer: MatchUpItem | null;
})[];
export type MissingWordAnswerType = Record<string, string>;

export type UserAnswers = GameShowAnswerType | MatchUpAnswerType;

type UserAnswerState = {
  data: GameDocTemplate | null;
  userAnswers: UserAnswers;
  score: number;
};

type CheckAnswer = {
  data: GameDocTemplate;
  userAnswers: UserAnswers;
  score: number;
};

const initialState: UserAnswerState = {
  data: null,
  userAnswers: {},
  score: 0,
};

export const userAnswerSlice = createSlice({
  name: "userAnswer",
  initialState,
  reducers: {
    setResult: (state, { payload }: PayloadAction<CheckAnswer>) => {
      state.data = payload.data;
      state.userAnswers = payload.userAnswers;
      state.score = payload.score;
    },
    setUserAnswer: (state, { payload }: PayloadAction<UserAnswers>) => {
      state.userAnswers = payload;
    },
    setData: (state, { payload }: PayloadAction<GameDocTemplate>) => {
      state.data = payload;
    },
  },
});

export const { setResult, setUserAnswer, setData } = userAnswerSlice.actions;
export const selectAnswer = (state: RootState) => state.userAnswer;

export default userAnswerSlice.reducer;
