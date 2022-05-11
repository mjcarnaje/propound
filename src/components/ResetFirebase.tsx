import { IconButton } from "@chakra-ui/react";
import { deleteDoc, getDocs, query } from "firebase/firestore";
import React from "react";
import { RiAlarmWarningFill } from "react-icons/ri";
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
      icon={<RiAlarmWarningFill fontSize="1.5rem" />}
      aria-label="Reset firebase"
    />
  );
};

export default ResetFirebase;
