import {
  BaseUserDocType,
  Role,
  StudentDocType,
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
