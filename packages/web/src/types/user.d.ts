import { ROLE } from "./role";

export interface BaseUserDocType {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface UserDocType extends BaseUserDocType {
  role: ROLE;
  createdGames: string[];
  enrolledGames: string[];
}
