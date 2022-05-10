import { ROLE } from "./role";

export interface UserDocType {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: ROLE;
  createdCourses: string[];
  enrolledCourses: string[];
}
