import { Text, VStack } from "@chakra-ui/react";
import React from "react";
//@ts-ignore
import EmptySvg from "../../assets/svgs/empty.svg?component";

interface EmptyProps {
  title?: string;
  maxHeight?: number;
  customSvg?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  title = "No result.",
  maxHeight = 200,
  customSvg: CustomSvg,
}) => {
  return (
    <VStack justify="center" spacing={8} py={12}>
      {CustomSvg ? (
        // @ts-ignore
        <CustomSvg style={{ maxHeight }} />
      ) : (
        <EmptySvg style={{ maxHeight }} />
      )}
      <Text fontWeight="medium">{title}</Text>
    </VStack>
  );
};

export default Empty;
