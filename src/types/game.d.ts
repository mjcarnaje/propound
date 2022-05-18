import { BaseUserDocType } from "./user";

export type GameType = "MATCH_UP" | "GAME_SHOW" | "MISSING_WORD" | null;

export type GameStatus = "PUBLISHED" | "DRAFT";

export interface GameDocType {
  id: string;
  name: string;
  code: string;
  teacher: BaseUserDocType;
  studentIds: string[];
  status: GameStatus;
  type: GameType;
}

export interface GameStudentDocType extends BaseUserDocType {
  result: string | null;
}
