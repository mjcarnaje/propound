import { Box, Text } from "@chakra-ui/react";
import { ClassDocType } from "../../types/class";

interface ClassCardProps {
  data: ClassDocType;
}

const ClassCard: React.FC<ClassCardProps> = ({ data }) => {
  return (
    <Box bg="white" p={8} rounded="md" shadow="md">
      <Text>{data.name}</Text>
    </Box>
  );
};

export default ClassCard;
