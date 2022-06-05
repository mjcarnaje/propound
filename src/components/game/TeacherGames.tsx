import { SimpleGrid, Spinner } from "@chakra-ui/react";
import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { gameCollection } from "../../firebase/collections";
import { AcitivityDocType } from "../../types/game";
import { UserDocType } from "../../types/user";
import GameCard from "./GameCard";

interface GamesProps {
  user: UserDocType;
}

const Games: React.FC<GamesProps> = ({ user }) => {
  const [games, setGames] = useState<AcitivityDocType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(gameCollection, where("teacher.uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const res: AcitivityDocType[] = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      setGames(res);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SimpleGrid gap={{ base: "4", md: "6" }} columns={{ base: 1, md: 3 }}>
      {loading && <Spinner />}
      {games.map((gameDoc) => (
        <GameCard data={gameDoc} key={gameDoc.id} />
      ))}
    </SimpleGrid>
  );
};

export default Games;
