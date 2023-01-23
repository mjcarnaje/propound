import { Text, VStack } from "native-base";
import React from "react";

interface TitleInstructionProps {
  title: string;
  instruction: string;
}

const TitleInstruction: React.FC<TitleInstructionProps> = ({
  title,
  instruction,
}) => {
  return (
    <VStack>
      <Text fontFamily="Inter-Bold" fontSize={28}>
        {title}
      </Text>
      <Text fontFamily="Inter-Regular" color="muted.500">
        {instruction}
      </Text>
    </VStack>
  );
};

export default TitleInstruction;
