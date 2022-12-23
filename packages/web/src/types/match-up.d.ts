import { BaseDocTemplate } from "./game";

export interface MatchUpItem {
  id: string;
  text: string;
  photo: string;
}

export interface MatchUpItemType {
  keyword: MatchUpItem;
  definition: MatchUpItem;
}

export interface MatchUpTemplate extends BaseDocTemplate {
  __typename: "MATCH_UP";
  items: MatchUpItemType[];
}
