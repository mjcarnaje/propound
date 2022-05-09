import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth, signOut } from "../../store/reducer/auth";
import { Logo } from "../Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

export const Navbar = () => {
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      w="full"
      bg="bg-surface"
      boxShadow={useColorModeValue("sm", "sm-dark")}
    >
      <Container py={{ base: "3", lg: "4" }}>
        <Flex justify="space-between">
          <HStack spacing="8">
            <Logo />
            {isDesktop && (
              <ButtonGroup variant="ghost" spacing="1">
                <Button aria-current="page">Home</Button>
              </ButtonGroup>
            )}
          </HStack>
          {isDesktop ? (
            <HStack spacing="4">
              <ButtonGroup variant="ghost" spacing="1">
                <IconButton
                  icon={<FiSearch fontSize="1.25rem" />}
                  aria-label="Search"
                />
                {!user ? (
                  <>
                    <Menu>
                      <MenuButton as={Button}>Login</MenuButton>
                      <MenuList>
                        <MenuItem as={Link} to="/t/login">
                          Teacher
                        </MenuItem>
                        <MenuItem as={Link} to="/s/login">
                          Student
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Button>Sign up</Button>
                  </>
                ) : (
                  <>
                    <Menu>
                      <MenuButton
                        cursor="pointer"
                        as={Avatar}
                        boxSize="10"
                        name={user.displayName}
                        src={user.photoURL}
                      />
                      <MenuList>
                        <MenuItem onClick={() => dispatch(signOut())}>
                          Sign out
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                )}
              </ButtonGroup>
            </HStack>
          ) : (
            <>
              <ToggleButton
                isOpen={isOpen}
                aria-label="Open Menu"
                onClick={onToggle}
              />
              <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                isFullHeight
                preserveScrollBarGap
                // Only disabled for showcase
                trapFocus={false}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <Sidebar />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
