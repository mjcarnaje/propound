import { Box, Center, Container } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar";

const CreateGame: React.FC = () => {
  const { game } = useParams();

  return (
    <Box as="section" h="1px" minH="100vh">
      <Navbar />
      <Container minH="calc(100vh - 86px)" h="1px" maxW="container.xl">
        <Center h="full">{game}</Center>
      </Container>
    </Box>
  );
};

export default CreateGame;
