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

export enum StudentCourse {
  BEEdLanguageEducation = "BEEd Language Education",
  BEEdScienceAndMathematics = "BEEd Science and Mathematics",
  BSEdBiology = "BSEd Biology",
  BSEdChemistry = "BSEd Chemistry",
  BSEdPhysics = "BSEd Physics",
  BSEdMathematics = "BSEd Mathematics",
  BachelorOfPhysicalEducation = "Bachelor of Physical Education",
  BTLEdHomeEconomics = "BTLEd Home Economics",
  BTVTEdDraftingTechnology = "BTVTEd Drafting Technology",
  BTLEdIndustrialArts = "BTLEd Industrial Arts",
}

export interface StudentDocType extends BaseUserDocType {
  role: Role.Student;
  year: StudentYear;
  course: StudentCourse;
  enrolledGames: string[];
}

export interface TeacherDocType extends BaseUserDocType {
  role: Role.Teacher;
  createdGames: string[];
}

export type UserDocType = StudentDocType | TeacherDocType;
