import {
  BaseUserDocType,
  Role,
  StudentDocType,
  StudentYear,
  TeacherDocType,
  UserDocType,
} from "@propound/types";

export function isStudentDocType(user: UserDocType): user is StudentDocType {
  return user.role === Role.Student;
}

export function isTeacherDocType(user: UserDocType): user is TeacherDocType {
  return user.role === Role.Teacher;
}

export function isAdminDocType(user: UserDocType): user is TeacherDocType {
  return user.role === Role.Admin;
}

export function isAuthoredDocType(user: UserDocType): user is TeacherDocType {
  return user.role === Role.Teacher || user.role === Role.Admin;
}

export function getFullName(user: BaseUserDocType) {
  return `${user.firstName} ${user.lastName}`;
}

export function getRomanYearLevel(str: StudentYear) {
  const map = {
    Freshman: "I",
    Sophomore: "II",
    Junior: "III",
    Senior: "IV",
  };
  return map[str];
}
