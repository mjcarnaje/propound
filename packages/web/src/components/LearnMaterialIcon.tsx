import { ColorProps, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BsLink45Deg, BsYoutube } from "react-icons/bs";
import { FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";
import { LearningMaterialType } from "../types/game";

interface LearnMaterialIconProps {
  type: LearningMaterialType;
}

export const LearnMaterialIcon: React.FC<LearnMaterialIconProps> = ({
  type,
}) => {
  const MaterialIcon: Record<LearningMaterialType, IconType> = {
    PDF: VscFilePdf,
    YOUTUBE: BsYoutube,
    LINK: BsLink45Deg,
    PPT: FaFilePowerpoint,
    WORD: FaFileWord,
  };
  const color: Record<LearningMaterialType, ColorProps["color"]> = {
    PDF: "red.500",
    YOUTUBE: "red.500",
    LINK: "red.500",
    PPT: "orange.500",
    WORD: "blue.500",
  };

  return (
    <Icon
      as={MaterialIcon[type]}
      color={color[type]}
      boxSize="30px"
      cursor="pointer"
    />
  );
};
