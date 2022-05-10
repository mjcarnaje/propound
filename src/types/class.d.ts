export interface StudentDocType {
  uid: string;
  displayName: string;
  email: string;
}

export interface ClassDocType {
  id: string;
  name: string;
  teacher: {
    uid: string;
    name: string;
    photoURL: string;
    email: string;
  };
  students: StudentDocType[];
}
