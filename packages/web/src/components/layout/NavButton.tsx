import { As, Button, ButtonProps, HStack, Icon, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { Link, useMatch } from "react-router-dom";

interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
  to?: string;
  onClick?: () => void;
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, to, onClick, ...buttonProps } = props;
  const isActive = useMatch(to || "");
  const Child = useCallback(() => {
    return (
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="subtle" />
        <Text>{label}</Text>
      </HStack>
    );
  }, []);

  if (to) {
    return (
      <Button
        w="full"
        variant="ghost"
        justifyContent="start"
        as={Link}
        to={to}
        isActive={!!isActive}
        {...buttonProps}
      >
        <Child />
      </Button>
    );
  }

  return (
    <Button
      w="full"
      variant="ghost"
      justifyContent="start"
      onClick={onClick}
      isActive={!!isActive}
      {...buttonProps}
    >
      <Child />
    </Button>
  );
};
