import { BaseDocTemplate } from "./game";

export interface PhotoMatchUp {
  id: string;
  photo: string;
}

export interface TextMatchUp {
  id: string;
  text: string;
}

export interface MatchUpItemType {
  photo: PhotoMatchUp;
  text: TextMatchUp;
}

export interface MatchUpTemplate extends BaseDocTemplate {
  __typename: "MATCH_UP";
  items: MatchUpItemType[];
}
