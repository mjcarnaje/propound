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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { deleteDoc, getDocs, query } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { gameCollection } from "../../firebase/collections";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth, signOut } from "../../store/reducer/auth";
import CreateGame from "../CreateGame";
import { LogoWithText } from "../LogoWithText";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

interface NavbarProps {
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLanding }) => {
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box as="nav" w="full" bg="white" boxShadow="xs" height="86px">
      <Box px={{ base: "4", md: "36" }} py={{ base: "3", lg: "4" }}>
        <Flex justify="space-between">
          <HStack spacing="8">
            <Box cursor="pointer" onClick={() => navigate("/")}>
              <LogoWithText />
            </Box>
            {isDesktop && !isLanding && (
              <ButtonGroup variant="ghost" spacing="1">
                <Button as={Link} to="/" aria-current="page">
                  Home
                </Button>
              </ButtonGroup>
            )}
          </HStack>

          {!isLanding && (
            <>
              {isDesktop ? (
                <HStack spacing="4">
                  <ButtonGroup variant="ghost" spacing="4">
                    {user && user.role === "TEACHER" && (
                      <CreateGame user={user} />
                    )}
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
                            <MenuItem
                              onClick={async () => {
                                try {
                                  const games = query(gameCollection);
                                  const querySnapshot = await getDocs(games);
                                  querySnapshot.forEach((doc) => {
                                    deleteDoc(doc.ref);
                                  });
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              Reset
                            </MenuItem>
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
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
