import { Container, Text } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";

interface TakeIndexProps {}

const TakeIndex: React.FC<TakeIndexProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();

  return (
    <MainLayout>
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        <Text>TakeIndex Activity</Text>
      </Container>
    </MainLayout>
  );
};

export default TakeIndex;
