import { Box, Center, Text } from "@chakra-ui/react";
import React from "react";
import SetGameType from "../../components/SetGameType";

const DashboardPreGame: React.FC = () => {
  return (
    <Center py={4}>
      <Box textAlign="center">
        <Text fontWeight="bold" fontSize={24}>
          Pre-Game
        </Text>
        <SetGameType />
      </Box>
    </Center>
  );
};

export default DashboardPreGame;
