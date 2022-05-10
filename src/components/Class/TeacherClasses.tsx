import { SimpleGrid, Spinner } from "@chakra-ui/react";
import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { classCollection } from "../../firebase/collections";
import { ClassDocType } from "../../types/class";
import { UserDocType } from "../../types/user";
import ClassCard from "./ClassCard";

interface ClassesProps {
  user: UserDocType;
}

const Classes: React.FC<ClassesProps> = ({ user }) => {
  const [classes, setClasses] = useState<ClassDocType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(classCollection, where("teacher.uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const res: ClassDocType[] = [];
      querySnapshot.forEach((doc) => {
        res.push({ ...doc.data(), id: doc.id });
      });
      setClasses(res);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SimpleGrid gap={{ base: "4", md: "6" }} columns={{ base: 1, md: 3 }}>
      {loading && <Spinner />}
      {classes.map((classDoc) => (
        <ClassCard data={classDoc} key={classDoc.id} />
      ))}
    </SimpleGrid>
  );
};

export default Classes;
