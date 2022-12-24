import { Center, Container, Spinner } from "@chakra-ui/react";
import { ActivityDocType, CollectionNames } from "@propound/types";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import React from "react";
import { QueryKey } from "react-query";
import { useParams } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { firestore } from "../../firebase/config";
import ActivitySummary from "./components/ActivitySummary";

export const ActivitySummaryPage: React.FC = () => {
  const { id } = useParams();

  const queryKey: QueryKey = [CollectionNames.ACTIVITIES, id];

  // @ts-ignore
  const ref: any = doc(firestore, ...queryKey);

  const activity = useFirestoreDocument<ActivityDocType>(queryKey, ref);

  if (activity.isLoading) {
    return (
      <MainLayout>
        <Center py={12}>
          <Spinner />
        </Center>
      </MainLayout>
    );
  }

  if (activity.isError) {
    return (
      <MainLayout>
        <Center py={12}>
          <h1>Error</h1>
        </Center>
      </MainLayout>
    );
  }

  const activityData = activity?.data?.data();

  if (!activityData) {
    return (
      <MainLayout>
        <Center py={12}>
          <h1>Activity not found</h1>
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        <ActivitySummary data={activityData} />
      </Container>
    </MainLayout>
  );
};
