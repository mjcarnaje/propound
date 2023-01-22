import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

export const formatDate = (
  date: { seconds: number; nanoseconds: number },
  format?: string
) => {
  return dayjs(Timestamp.fromMillis(date.seconds * 1000).toDate()).format(
    format || "DD MMM YYYY"
  );
};
