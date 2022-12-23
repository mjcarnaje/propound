import { doc, DocumentReference, Firestore } from "firebase/firestore";

export const getRef = <T extends any>(
  firestore: Firestore,
  path: string,
  ...pathSegments: string[]
) => {
  return doc(firestore, path, ...pathSegments) as DocumentReference<T>;
};
