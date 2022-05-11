export interface StudentDocType {
  uid: string;
  displayName: string;
  email: string;
}

export interface GameDocType {
  id: string;
  name: string;
  code: string;
  teacher: {
    uid: string;
    name: string;
    photoURL: string;
    email: string;
  };
  students: StudentDocType[];
  status: "PUBLISHED" | "DRAFT";
}
