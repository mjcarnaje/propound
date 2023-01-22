import { BaseDocTemplate } from "./game";

export type MissingWordQuestionType = {
  id: string;
  question: string;
  answerIdx: number | null;
  incorrect: string[];
};

export interface MissingWordTemplate extends BaseDocTemplate {
  __typename: "MISSING_WORD";
  questions: MissingWordQuestionType[];
}
