import { BaseDocTemplate } from "./game";

export type GameShowChoiceType = {
  id: string;
  choice: string;
  photoURL: string;
};

export type GameShowQuestionType = {
  id: string;
  question: string;
  photoURL: string | null;
  choices: GameShowChoiceType[];
  answer: string;
};

export interface GameShowTemplate extends BaseDocTemplate {
  __typename: "GAME_SHOW";
  questions: GameShowQuestionType[];
}
