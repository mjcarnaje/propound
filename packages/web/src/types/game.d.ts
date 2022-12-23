import { FieldValue } from "firebase/firestore";
import { GameShowTemplate } from "./game-show";
import { MatchUpTemplate } from "./match-up";
import { MissingWordTemplate } from "./missing-word";
import { BaseUserDocType } from "./user";

export type GameStatus = "PUBLISHED" | "DRAFT";

export type LearningMaterialType = "YOUTUBE" | "PDF" | "PPT" | "WORD" | "LINK";

export type LearningMaterial = {
  id: string;
  type: LearningMaterialType;
  url: string;
  title: string;
};

export interface AcitivityDocType {
  id: string;
  title: string;
  description: string;
  coverPhoto: string;
  code: string;
  teacher: BaseUserDocType;
  studentIds: string[];
  status: GameStatus;
  createdAt: FieldValue;
}

export interface AcitivityStudentDocType {
  status: {
    preGameDone: boolean;
    learningDone: boolean;
    postGameDone: boolean;
  };
  student: BaseUserDocType;
  scores: {
    [key: string]: {
      scores: { score: number; time: number }[];
      average: { score: number | null; time: number | null };
      latestScore: number;
      latestDate: Date | null;
      baseDate: Date | null;
    };
  };
}

export type GameType = "PRE_TEST" | "POST_TEST";

export type GameTemplate = "GAME_SHOW" | "MATCH_UP" | "MISSING_WORD";

export type GameDocTemplate =
  | GameShowTemplate
  | MatchUpTemplate
  | MissingWordTemplate;

export interface BaseDocTemplate {
  type: GameType;
  id: string;
  title: string;
  instruction: string;
  total: number;
}
