import { As, Button, ButtonProps, HStack, Icon, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
  href: string;
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, href, ...buttonProps } = props;
  return (
    <Button
      as={Link}
      to={href}
      w="full"
      variant="ghost"
      justifyContent="start"
      {...buttonProps}
    >
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="subtle" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};
