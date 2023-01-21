export enum Role {
  Student = "Student",
  Teacher = "Teacher",
  Admin = "Admin",
}

export interface BaseUserDocType {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
}

export enum StudentYear {
  Freshman = "Freshman",
  Sophomore = "Sophomore",
  Junior = "Junior",
  Senior = "Senior",
}

export interface StudentDocType extends BaseUserDocType {
  role: Role.Student;
  year: StudentYear;
  courseSection: string;
  enrolledGames: string[];
}

export interface TeacherDocType extends BaseUserDocType {
  role: Role.Teacher;
  createdGames: string[];
}

export interface AdminDocType extends BaseUserDocType {
  role: Role.Admin;
  createdGames: string[];
}

export type AuthoredDocType = TeacherDocType | AdminDocType;

export type UserDocType = StudentDocType | AuthoredDocType;
