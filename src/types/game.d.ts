import { GameShowTemplate } from "./game-show";
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
}

export interface AcitivityStudentDocType extends BaseUserDocType {
  taken: boolean;
  score: number;
}

export type GameType = "PRE_TEST" | "POST_TEST";

export type GameTemplate = "GAME_SHOW" | "MATCH_UP" | "MISSING_WORD";

export type GameDocTemplate = GameShowTemplate;
