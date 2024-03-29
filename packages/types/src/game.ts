import { GameShowTemplate } from "./game-show";
import { MatchUpTemplate } from "./match-up";
import { MissingWordTemplate } from "./missing-word";
import { BaseUserDocType, Role, StudentDocType } from "./user";

export type GameStatus = "PUBLISHED" | "DRAFT";

export type LearningMaterialType = "YOUTUBE" | "PDF" | "PPT" | "WORD" | "LINK";

export type LearningMaterial = {
  id: string;
  type: LearningMaterialType;
  url: string;
  title: string;
};

export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ActivityDocType {
  id: string;
  title: string;
  description: string;
  coverPhoto: string;
  code: string;
  author: BaseUserDocType & { role: Role };
  studentIds: string[];
  status: GameStatus;
  createdAt: FirebaseTimestamp;
}

export enum GameType {
  PRE_TEST = "PRE_TEST",
  POST_TEST = "POST_TEST",
}

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

export interface StatusAndScore {
  status: {
    preGameDone: boolean;
    learningDone: boolean;
    postGameDone: boolean;
  };
  scores: Record<
    GameType,
    {
      scores: { score: number; time: number }[];
      average: { score: number | null; time: number | null };
      latestScore: number;
      latestDate: FirebaseTimestamp | null;
      baseDate: FirebaseTimestamp | null;
    }
  >;
}

export interface StudentResultDocType extends StatusAndScore {
  activityId: string;
}

export interface ActivityStudentResultDocType extends StatusAndScore {
  student: Omit<StudentDocType, "role" | "enrolledGames">;
}
