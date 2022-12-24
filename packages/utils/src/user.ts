import { BaseUserDocType, Role, StudentDocType, TeacherDocType, UserDocType } from "@propound/types";

export function isStudentDocType(user: UserDocType): user is StudentDocType {
  return user.role === Role.Student;
}

export function isTeacherDocType(user: UserDocType): user is TeacherDocType {
  return user.role === Role.Teacher;
}

export function getFullName(user: BaseUserDocType) {
  return `${user.firstName} ${user.lastName}`;
}
