export interface StudentDocType {
  uid: string;
  displayName: string;
  email: string;
}

export type GameType = "MATCH_UP" | "GAME_SHOW" | "MISSING_WORD" | null;

export type GameStatus = "PUBLISHED" | "DRAFT";

export interface GameDocType {
  id: string;
  name: string;
  code: string;
  teacher: {
    uid: string;
    name: string;
    photoURL: string;
    email: string;
  };
  students: StudentDocType[];
  status: GameStatus;
  type: GameType;
}
