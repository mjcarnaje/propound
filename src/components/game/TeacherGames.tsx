import { AddIcon } from "@chakra-ui/icons";
import { Button, Center, SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { gameCollection } from "../../firebase/collections";
import { AcitivityDocType } from "../../types/game";
import { UserDocType } from "../../types/user";
import CreateGame from "../CreateGame";
import Empty from "../svg/EmptySvg";
import GameCard from "./GameCard";

interface GamesProps {
  user: UserDocType;
}

const Games: React.FC<GamesProps> = ({ user }) => {
  const [games, setGames] = useState<AcitivityDocType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(gameCollection, where("teacher.uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const res: AcitivityDocType[] = [];
      querySnapshot.forEach((doc) => {
        res.push(doc.data());
      });
      setGames(res);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <SimpleGrid gap={{ base: "4", md: "6" }} columns={{ base: 1, md: 3 }}>
        {games.map((gameDoc) => (
          <GameCard data={gameDoc} key={gameDoc.id} />
        ))}
      </SimpleGrid>
      {loading && (
        <Center>
          <Spinner />
        </Center>
      )}
      {games.length === 0 && !loading && (
        <VStack>
          <Empty maxHeight={420} title="No Learning Space created yet." />
          <CreateGame
            user={user}
            button={({ onOpen }) => (
              <Button onClick={onOpen} leftIcon={<AddIcon fontSize={12} />}>
                Create
              </Button>
            )}
          />
        </VStack>
      )}
    </>
  );
};

export default Games;
