import { Divider, Flex, Stack } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BiLogOut } from "react-icons/bi";
import { FiBarChart2, FiHelpCircle, FiHome, FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth, signOut } from "../../store/reducer/auth";
import { ROLE } from "../../types/role";
import { LogoWithText } from "../LogoWithText";
import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";

interface NavButtonItem {
  icon: IconType;
  label: string;
  href: string;
  role: ROLE | "ALL";
}

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const navButtons: NavButtonItem[] = [
    {
      icon: FiHome,
      label: "Home",
      href: "/",
      role: "ALL",
    },
    {
      icon: FiBarChart2,
      label: "Dashboard",
      href: "/dashboard",
      role: "TEACHER",
    },
  ];

  return (
    <Flex as="section" minH="100vh" boxShadow="sm" zIndex="1" bg="white">
      <Flex
        flex="1"
        overflowY="auto"
        w="276px"
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Stack w="full" justify="space-between" spacing="1">
          <Stack w="full" spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
            <NavLink to="/">
              <LogoWithText mx="auto" />
            </NavLink>
            <Stack w="full" spacing="1">
              {navButtons.map((button) => {
                if (
                  button.role === "ALL" ||
                  (user && user.role === button.role)
                ) {
                  return (
                    <NavButton
                      key={button.label}
                      icon={button.icon}
                      label={button.label}
                      to={button.href}
                    />
                  );
                }
                return null;
              })}
            </Stack>
          </Stack>

          <Stack spacing={{ base: "5", sm: "6" }}>
            <Stack spacing="1">
              <NavButton label="Help" icon={FiHelpCircle} to="/help" />
              <NavButton label="Settings" icon={FiSettings} to="/settings" />
              {user && (
                <NavButton
                  label="Logout"
                  icon={BiLogOut}
                  onClick={() => dispatch(signOut())}
                />
              )}
            </Stack>
            <Divider />
            <UserProfile
              name={user.displayName}
              image={user.photoURL}
              email={user.email}
            />
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
