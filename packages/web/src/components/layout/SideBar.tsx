import { Divider, Flex, Stack } from "@chakra-ui/react";
import { Role } from "@propound/types";
import { IconType } from "react-icons";
import { BiLogOut } from "react-icons/bi";
import { FiBarChart, FiBarChart2, FiPlus } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth, signOut } from "../../store/reducer/auth";
import { LogoWithText } from "../LogoWithText";
import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";

interface NavButtonItem {
  icon: IconType;
  label: string;
  href: string;
  role: Role | "ALL";
}

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuth);

  const navButtons: NavButtonItem[] = [
    {
      icon: FiPlus,
      label: "Create a learning space",
      href: "/create",
      role: "ALL",
    },
    {
      icon: FiBarChart2,
      label: "Dashboard",
      href: "/dashboard",
      role: "ALL",
    },
  ];

  return (
    <Flex as="section" minH="100vh" boxShadow="sm" zIndex="1" bg="white">
      <Flex
        flex="1"
        overflowY="auto"
        w="320px"
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
              {user && (
                <NavButton
                  label="Logout"
                  icon={BiLogOut}
                  onClick={async () => {
                    await dispatch(signOut());
                    navigate("/landing");
                  }}
                />
              )}
            </Stack>
            <Divider />
            {user && (
              <UserProfile
                name={user.firstName + user.lastName}
                image={user.photoURL}
                email={user.email}
              />
            )}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
