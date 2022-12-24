export enum Role {
  Student = "Student",
  Teacher = "Teacher",
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
  course: string;
  enrolledGames: string[];
}

export interface TeacherDocType extends BaseUserDocType {
  role: Role.Teacher;
  createdGames: string[];
}

export type UserDocType = StudentDocType | TeacherDocType;
