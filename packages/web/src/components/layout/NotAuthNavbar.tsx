import { Box, Button, HStack } from "@chakra-ui/react";
import { FaLightbulb } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoWithText } from "../LogoWithText";

interface NotAuthNavbarProps {}

const NotAuthNavbar: React.FC<NotAuthNavbarProps> = () => {
  const navigate = useNavigate();

  return (
    <HStack
      as="nav"
      w="full"
      bg="white"
      boxShadow="xs"
      height="86px"
      justify="space-around"
    >
      <NavLink to="/">
        <LogoWithText />
      </NavLink>
      <HStack spacing={4}>
        <Button
          size="lg"
          onClick={() => navigate("/about")}
          bg="white"
          color="gray.900"
          _hover={{ bg: "gray.50" }}
          px="8"
          leftIcon={<Box as={FaLightbulb} fontSize="xl" />}
        >
          Learn more
        </Button>
        <Button
          size="lg"
          minW="210px"
          colorScheme="orange"
          px="8"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </HStack>
    </HStack>
  );
};

export default NotAuthNavbar;
