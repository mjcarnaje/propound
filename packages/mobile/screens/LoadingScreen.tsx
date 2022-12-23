import { Center, Spinner } from "native-base";
import React from "react";
import BaseScreen from "../components/BaseScreen";

const LoadingScreen: React.FC = () => {
  return (
    <BaseScreen>
      <Center flexGrow={1}>
        <Spinner size="lg" color="orange.600" />
      </Center>
    </BaseScreen>
  );
};

export default LoadingScreen;
