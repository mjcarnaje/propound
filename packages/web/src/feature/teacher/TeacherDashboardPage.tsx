import { PlusSquareIcon } from "@chakra-ui/icons";
import { Button, Center, Container, Spinner, VStack } from "@chakra-ui/react";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, limit, Query, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ActivityCard from "../../components/activity/ActivityCard";
import { CreateActivity } from "../../components/CreateActivity";
import { MainLayout } from "../../components/layout/MainLayout";
import Empty from "../../components/svg/EmptySvg";
import { firestore } from "../../firebase/config";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { AcitivityDocType } from "../../types/game";

export const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);

  const ref = query(
    collection(firestore, "activity"),
    limit(16),
    where("teacher.uid", "==", user!.uid)
  ) as Query<AcitivityDocType>;

  const games = useFirestoreQuery<AcitivityDocType>(["games"], ref, {
    subscribe: true,
  });

  if (games.isLoading) {
    return (
      <MainLayout>
        <Center py={24}>
          <Spinner />
        </Center>
      </MainLayout>
    );
  }

  if (games.isError) {
    return (
      <MainLayout>
        <h1>Error</h1>
      </MainLayout>
    );
  }

  const snapshot = games.data;
  const gamesDocs = snapshot?.docs.map((doc) => doc.data()) || [];

  return (
    <MainLayout>
      <Container py={{ base: "16", md: "24" }}>
        <VStack spacing={8}>
          {gamesDocs.length === 0 && (
            <VStack>
              <Empty maxHeight={420} title="No Learning Space created yet." />
              <CreateActivity
                user={user!}
                button={({ onOpen }) => (
                  <CreateActivity
                    user={user!}
                    button={({ onOpen }) => (
                      <Button
                        onClick={() => navigate("/create")}
                        colorScheme="orange"
                        leftIcon={<PlusSquareIcon />}
                      >
                        Create Learning Space
                      </Button>
                    )}
                  />
                )}
              />
            </VStack>
          )}
          {gamesDocs.map((gameDoc) => {
            return <ActivityCard data={gameDoc} key={gameDoc.id} isMine />;
          })}
        </VStack>
      </Container>
    </MainLayout>
  );
};
