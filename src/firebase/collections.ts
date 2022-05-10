import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { ClassDocType } from "../types/class";
import { UserDocType } from "../types/user";
import { firestore } from "./config";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const userCollection = createCollection<UserDocType>("user");
export const classCollection = createCollection<ClassDocType>("class");
