import {
  Box,
  Center,
  Container,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { doc, getDoc, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import SetGameType from "../../components/SetGameType";
import { gameCollection } from "../../firebase/collections";
import { GameDocType } from "../../types/game";

interface GameDashboardProps {}

const GameDashboard: React.FC<GameDashboardProps> = () => {
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GameDocType>();

  async function getGameData() {
    try {
      setLoading(true);
      const gameRef = doc(gameCollection, id);
      const gameDoc = await getDoc(gameRef);
      if (gameDoc.exists()) {
        setData(gameDoc.data());
        console.log(gameDoc.data());
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getGameData();
  }, [id]);

  return (
    <Box as="section" h="1px" minH="100vh">
      <Navbar />
      <Container minH="calc(100vh - 86px)" h="1px" maxW="container.xl">
        <Center h="full">
          {loading && <Spinner />}
          {error && <Text>{error}</Text>}
          {data && data.type === null && <SetGameType />}
        </Center>
      </Container>
    </Box>
  );
};

export default GameDashboard;
