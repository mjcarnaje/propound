import { Center, Container, Spinner } from "@chakra-ui/react";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { JoinActivity } from "../../components/activity/JoinActivity";
import { MainLayout } from "../../components/layout/MainLayout";
import { firestore } from "../../firebase/config";
import { getRef } from "../../firebase/util";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { AcitivityDocType } from "../../types/game";
import ActivitySummary from "./components/ActivitySummary";

export const ActivitySummaryPage: React.FC = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();

  const ref = getRef<AcitivityDocType>(firestore, "activity", id!);

  const activity = useFirestoreDocument(["activity", id], ref);

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

  const isMine = activityData.teacher.uid === user?.uid;
  const isJoined =
    isMine || activityData.studentIds.some((id) => id === user?.uid);

  return (
    <MainLayout>
      <Container py={{ base: "4", md: "8" }} minH="100vh" h="1px">
        {isJoined ? (
          <ActivitySummary data={activityData} />
        ) : (
          <JoinActivity
            id={id!}
            studentIds={activityData.studentIds}
            code={activityData.code}
          />
        )}
      </Container>
    </MainLayout>
  );
};
