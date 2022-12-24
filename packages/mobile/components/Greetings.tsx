import { getFullName } from "@propound/utils";
import { Box, Text } from "native-base";
import React from "react";
import { useAuthStore } from "../store/auth";

const getGreetings = (): "Morning" | "Afternoon" | "Evening" => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Morning";
  }
  if (hour < 18) {
    return "Afternoon";
  }
  return "Evening";
};

const Greetings: React.FC = () => {
  const { user } = useAuthStore();
  const greetings = getGreetings();

  return (
    <Box>
      <Text
        fontFamily="Inter-Medium"
        color="muted.600"
        fontSize={18}
      >{`Good ${greetings},`}</Text>
      <Text
        fontFamily="Inter-Bold"
        fontSize={24}
        color="muted.800"
        lineHeight={28}
      >
        {getFullName(user)}
      </Text>
    </Box>
  );
};

export default Greetings;
