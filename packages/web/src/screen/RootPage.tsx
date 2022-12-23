import { Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";

const RootPage = () => {
  const { user, loading } = useAppSelector(selectAuth);

  if (loading) {
    return <Spinner />;
  }

  if (user?.role === "STUDENT") {
    return <Navigate to="/explore" />;
  }

  if (user?.role === "TEACHER") {
    return <Navigate to="/dashboard" />;
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return <div>RootPage</div>;
};

export default RootPage;
