import { Box, Text, VStack } from "native-base";
import React from "react";

interface GameProgressProps {
  current: number;
  total: number;
}

const GameProgress: React.FC<GameProgressProps> = ({ current, total }) => {
  return (
    <VStack space={2} alignItems="center">
      <Text fontFamily="Montserrat-Bold" color="muted.700">
        {`${current + 1} OF ${total}`}
      </Text>
      <Box borderRadius="xl" w="full" bg="gray.300" h={2.5}>
        <Box
          bg="orange.400"
          w={`${((current + 1) / total) * 100}%`}
          h="full"
          borderRadius="xl"
        />
      </Box>
    </VStack>
  );
};

export default GameProgress;
