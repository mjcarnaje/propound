import { IconButton } from "@chakra-ui/react";
import { deleteDoc, getDocs, query } from "firebase/firestore";
import React from "react";
import { TiFolderDelete } from "react-icons/ti";
import { gameCollection } from "../firebase/collections";

const ResetFirebase = () => {
  const [loading, setLoading] = React.useState(false);

  async function resetFirebase() {
    try {
      setLoading(true);
      const games = query(gameCollection);
      const querySnapshot = await getDocs(games);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <IconButton
      isLoading={loading}
      onClick={resetFirebase}
      icon={<TiFolderDelete fontSize="1.5rem" />}
      aria-label="Reset firebase"
      color="red.300"
    />
  );
};

export default ResetFirebase;
