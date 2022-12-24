import { MatchUpTemplate } from "@propound/types";
import { Center, Text, VStack } from "native-base";
import React from "react";

interface MatchUpGameProps {
  data: MatchUpTemplate;
}

const MatchUpGame: React.FC<MatchUpGameProps> = ({ data }) => {
  return (
    <VStack space={8} w="90%" mx="auto">
      <VStack>
        <Text fontFamily="Inter-Bold" fontSize={28}>
          {data.title}
        </Text>
        <Text fontFamily="Inter-Regular" color="muted.500">
          Match-Up Game
        </Text>
      </VStack>
      <Center>
        <Text fontFamily="Inter-Regular" color="muted.500">
          Coming Soon
        </Text>
      </Center>
    </VStack>
  );
};

export default MatchUpGame;
