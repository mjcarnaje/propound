import { Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { selectAuth } from "../store/reducer/auth";

const RootPage = () => {
  const { user, loading } = useAppSelector(selectAuth);

  if (loading) {
    return <Spinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return <div>Something went wrong</div>;
};

export default RootPage;
