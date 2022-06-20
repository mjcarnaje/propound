import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../../components/navbar";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";

interface TakeIndexProps {}

const TakeIndex: React.FC<TakeIndexProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();

  return (
    <Box as="section" h="1px" minH="100vh">
      <Navbar />
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        <Text>TakeIndex Activity</Text>
      </Container>
    </Box>
  );
};

export default TakeIndex;
