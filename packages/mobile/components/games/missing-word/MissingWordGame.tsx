import { MissingWordTemplate } from "@propound/types";
import { Box } from "native-base";
import React from "react";

interface MissingWordGameProps {
  data: MissingWordTemplate;
}

const MissingWordGame: React.FC<MissingWordGameProps> = ({ data }) => {
  return <Box style={{ flexGrow: 1 }}>{JSON.stringify(data, null, 2)}</Box>;
};

export default MissingWordGame;
