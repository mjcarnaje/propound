import { CopyIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ActivityDocType, GameStatus } from "@propound/types";
import { getFullName } from "@propound/utils";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import ActivityCardCoverPhoto from "./ActivityCardCoverPhoto";

interface ActivityCardProps {
  data: ActivityDocType;
  isJoined?: boolean;
  isMine?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  data,
  isJoined,
  isMine,
}) => {
  const toast = useToast();
  const navigate = useNavigate();

  const getStatusColor = (status: GameStatus): string => {
    switch (status) {
      case "DRAFT":
        return "gray";
      case "PUBLISHED":
        return "green";
    }
  };

  return (
    <HStack
      w="full"
      transition="all 0.2s"
      bg="white"
      rounded="2xl"
      shadow="sm"
      overflow="hidden"
      p={4}
      spacing={8}
      alignItems="start"
    >
      <ActivityCardCoverPhoto data={data} />
      <VStack align="flex-start" w="full" spacing={4}>
        <HStack justify="space-between" align="flex-start" w="full">
          <VStack align="flex-start" w="full" spacing={2}>
            <Heading
              fontFamily="Inter"
              color="gray.800"
              as="h4"
              fontWeight="bold"
              size="md"
            >
              {data.title}
            </Heading>
            <Text
              fontStyle="italic"
              fontSize="17px"
              whiteSpace="pre-line"
              wordBreak="break-word"
              noOfLines={8}
            >
              {data.description}
            </Text>
          </VStack>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FiMoreVertical />}
            />
            <MenuList>
              <MenuItem
                onClick={() => navigate(`/g/${data.id}/settings`)}
                icon={<EditIcon />}
              >
                Edit
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <HStack w="full" justify="space-between">
          <HStack alignItems="center" spacing={4}>
            <Avatar
              src={data.author.photoURL}
              name={getFullName(data.author)}
            />
            <VStack align="self-start" spacing={0}>
              <Text lineHeight={1} fontWeight="bold">
                {getFullName(data.author)}
              </Text>
              <Text fontSize="sm">{data.author.email}</Text>
            </VStack>
          </HStack>
        </HStack>
        <Box>
          {isMine && (
            <Tag colorScheme={getStatusColor(data.status)}>{data.status}</Tag>
          )}
          {isJoined && <Tag colorScheme="green">Joined</Tag>}
        </Box>
        <HStack spacing={3} alignItems="center">
          <Text
            fontSize={18}
            fontWeight="extrabold"
            letterSpacing="normal"
            color="gray.700"
          >
            CODE:
          </Text>
          <Text fontWeight="semibold" letterSpacing="tight" color="orange.500">
            {data.code}
          </Text>
          <Tooltip label="Copy code" aria-label="Copy code">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(data.code);
                toast({
                  title: "Copied",
                  description: "Code copied to clipboard",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
              size="sm"
              aria-label="Copy code"
              icon={<CopyIcon />}
            />
          </Tooltip>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default ActivityCard;
