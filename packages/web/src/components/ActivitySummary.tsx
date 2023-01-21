import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ActivityDocType } from "@propound/types";
import { getFullName } from "@propound/utils";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ActivitySummaryProps {
  data: ActivityDocType;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Box mx="auto" maxW="container.md">
      <VStack spacing={6}>
        <Box w="full">
          <HStack alignItems="center" spacing={4}>
            <Avatar src={data.author.photoURL} />
            <VStack align="self-start" spacing={0}>
              <Text lineHeight={1} fontWeight="bold">
                {getFullName(data.author)}
              </Text>
              <Text fontStyle="italic" fontSize="sm">
                {data.author.email}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <AspectRatio
          w="full"
          overflow="hidden"
          rounded="2xl"
          bg="gray.50"
          ratio={16 / 9}
        >
          <>
            <Image
              src={
                data.coverPhoto ||
                "https://images.unsplash.com/photo-1532190761747-215949f288d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGFyayUyMGJsdXJ8ZW58MHx8MHx8&w=1000&q=80"
              }
              objectFit="cover"
            />
            {!data.coverPhoto && (
              <Box>
                <Text fontSize={18} fontWeight="semibold" color="white">
                  No cover photo
                </Text>
              </Box>
            )}
          </>
        </AspectRatio>
        <VStack w="full">
          <Heading fontFamily="Inter" as="h4" fontWeight="bold" size="md">
            {data.title}
          </Heading>
          <Text
            fontStyle="italic"
            fontSize="18px"
            whiteSpace="pre-line"
            wordBreak="break-word"
          >
            {data.description}
          </Text>
        </VStack>
        <HStack spacing={4} py={6}>
          <Button
            onClick={() => navigate(`/activity/${data.id}/take?type=PRE_TEST`)}
          >
            Take Pre-test
          </Button>
          <Button onClick={() => navigate(`/activity/${data.id}/learn`)}>
            Learning Materials
          </Button>
          <Button
            onClick={() => navigate(`/activity/${data.id}/take?type=POST_TEST`)}
          >
            Take Post-test
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ActivitySummary;
