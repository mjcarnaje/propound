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

export type GameShowTemplate = {
  __typename: "GAME_SHOW";
  type: GameType;
  id: string;
  title: string;
  instruction: string;
  questions: GameShowQuestionType[];
};
