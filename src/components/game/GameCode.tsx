import { HStack, IconButton, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCopy } from "react-icons/ai";

interface GameCodeProps {
  gameId: string;
  code: string;
}

const GameCode: React.FC<GameCodeProps> = ({ gameId, code }) => {
  function copyToClipboard() {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_URL}/g/${gameId}?code=${code}`
    );
  }

  return (
    <HStack alignItems="center">
      <Text fontSize={15}>Game code</Text>
      <Text fontSize={18} color="orange.500" fontWeight="semibold">
        {code}
      </Text>
      <Tooltip label="Copy invite link">
        <IconButton
          onClick={copyToClipboard}
          icon={<AiOutlineCopy fontSize="1.2rem" />}
          aria-label="Reset firebase"
          color="gray.600"
        />
      </Tooltip>
    </HStack>
  );
};

export default GameCode;
