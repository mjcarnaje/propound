import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";
//@ts-ignore
import EmptySvg from "../../assets/svgs/empty.svg?component";

interface EmptyProps {
  title?: string;
  maxHeight?: number;
}

const Empty: React.FC<EmptyProps> = ({
  title = "No result.",
  maxHeight = 200,
}) => {
  return (
    <VStack justify="center" spacing={8} py={12}>
      <EmptySvg style={{ maxHeight }} />
      <Text>{title}</Text>
    </VStack>
  );
};

export default Empty;
