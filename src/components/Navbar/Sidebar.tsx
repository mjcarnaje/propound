import { Icon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiBarChart2,
  FiHelpCircle,
  FiHome,
  FiSearch,
  FiSettings,
} from "react-icons/fi";
import { Logo } from "../Logo";
import { UserProfile } from "../UserProfile";
import { NavButton } from "./NavButton";

export const Sidebar = () => (
  <Flex as="section" minH="100vh" bg="bg-canvas">
    <Flex
      flex="1"
      bg="bg-surface"
      overflowY="auto"
      boxShadow={useColorModeValue("sm", "sm-dark")}
      maxW={{ base: "full", sm: "xs" }}
      py={{ base: "6", sm: "8" }}
      px={{ base: "4", sm: "6" }}
    >
      <Stack justify="space-between" spacing="1">
        <Stack spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
          <Logo />
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="muted" boxSize="5" />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>
          <Stack spacing="1">
            <NavButton label="Home" aria-current="page" icon={FiHome} />
            <NavButton label="Dashboard" icon={FiBarChart2} />
          </Stack>
        </Stack>
        <Stack spacing={{ base: "5", sm: "6" }}>
          <Button>Login</Button>
          {/* <UserProfile
            name="Christoph Winston"
            image="https://tinyurl.com/yhkm2ek8"
            email="chris@chakra-ui.com"
          /> */}
        </Stack>
      </Stack>
    </Flex>
  </Flex>
);
