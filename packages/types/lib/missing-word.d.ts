import { BaseDocTemplate } from "./game";
export type WordType = {
    id: string;
    text: string;
    isSelected: boolean;
};
export type MissingWordQuestionType = {
    id: string;
    question: WordType[];
    incorrectWords: WordType[];
};
export interface MissingWordTemplate extends BaseDocTemplate {
    __typename: "MISSING_WORD";
    questions: MissingWordQuestionType[];
}
