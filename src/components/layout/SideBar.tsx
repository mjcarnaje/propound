import { Divider, Flex, Stack } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiBarChart2, FiHelpCircle, FiHome, FiSettings } from "react-icons/fi";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
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
            <LogoWithText mx="auto" />

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
                      href={button.href}
                    />
                  );
                }
                return null;
              })}
            </Stack>
          </Stack>

          <Stack spacing={{ base: "5", sm: "6" }}>
            <Stack spacing="1">
              <NavButton label="Help" icon={FiHelpCircle} href="/help" />
              <NavButton label="Settings" icon={FiSettings} href="/settings" />
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
