import {
  ActivityDocType,
  CollectionNames,
  StudentDocType,
  TeacherDocType,
} from "@propound/types";
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
} from "firebase/firestore";

export class PropoundFirebase {
  private firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  createCollection<T = DocumentData>(
    collectionName: CollectionNames
  ): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  getCollections(): {
    activities: CollectionReference<ActivityDocType>;
    students: CollectionReference<StudentDocType>;
    teachers: CollectionReference<TeacherDocType>;
  } {
    return {
      activities: this.createCollection<ActivityDocType>(
        CollectionNames.ACTIVITIES
      ),
      students: this.createCollection<StudentDocType>(CollectionNames.STUDENTS),
      teachers: this.createCollection<TeacherDocType>(CollectionNames.TEACHERS),
    };
  }
}
