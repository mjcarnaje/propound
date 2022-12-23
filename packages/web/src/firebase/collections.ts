import {
  collection,
  CollectionReference,
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
export const activityCollection =
  createCollection<AcitivityDocType>("activity");

export const gameSubCollection = <T extends any>(
  id: string,
  ...pathSegments: string[]
) => createCollection<T>("activity", id, ...pathSegments);