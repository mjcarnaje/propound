import React from "react";
import { Navigate, useParams } from "react-router-dom";

const DashboardIndex: React.FC = () => {
  const { id } = useParams();
  return <Navigate to={`/g/${id}/pre-game`} />;
};

export default DashboardIndex;
