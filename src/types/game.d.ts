import { BaseUserDocType } from "./user";

export type GameType = "MATCH_UP" | "GAME_SHOW" | "MISSING_WORD" | null;

export type GameStatus = "PUBLISHED" | "DRAFT";

export type LearningMaterialType = "YOUTUBE" | "PDF" | "PPT" | "WORD" | "LINK";

export type Game = {
  id: string;
  type: GameType;
};

export type LearningMaterial = {
  id: string;
  type: LearningMaterialType;
  url: string;
  title: string;
};

export interface GameDocType {
  id: string;
  name: string;
  instruction: string;
  code: string;
  teacher: BaseUserDocType;
  studentIds: string[];
  status: GameStatus;
  games: Game[];
}

export interface GameStudentDocType extends BaseUserDocType {
  result: string | null;
}
