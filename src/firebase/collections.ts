import { BaseUserDocType } from "./../types/user.d";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
} from "firebase/firestore";
import { AcitivityDocType } from "../types/game";
import { UserDocType } from "../types/user";
import { firestore } from "./config";

const createCollection = <T = DocumentData>(
  collectionName: string,
  ...pathSegments: string[]
) => {
  return collection(
    firestore,
    collectionName,
    ...pathSegments
  ) as CollectionReference<T>;
};

export const userCollection = createCollection<UserDocType>("user");
export const gameCollection = createCollection<AcitivityDocType>("game");
export const gameSubCollection = <T extends any>(
  id,
  ...pathSegments: string[]
) => createCollection<T>("game", id, ...pathSegments);
