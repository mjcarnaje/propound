import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

export const formatDate = (date: { seconds: number; nanoseconds: number }) => {
  return dayjs(Timestamp.fromMillis(date.seconds * 1000).toDate()).format(
    "DD MMM YYYY"
  );
};
