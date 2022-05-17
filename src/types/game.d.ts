export type GameType = "MATCH_UP" | "GAME_SHOW" | "MISSING_WORD" | null;

export type GameStatus = "PUBLISHED" | "DRAFT";

export interface GameDocType {
  id: string;
  name: string;
  code: string;
  teacher: BaseUserDocType;
  students: BaseUserDocType[];
  status: GameStatus;
  type: GameType;
}
