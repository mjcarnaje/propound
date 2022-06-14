import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Flex,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

const DashboardSettings = () => {
  return (
    <Box>
      <Stack
        spacing="5"
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
      >
        <Box textAlign="center">
          <Heading fontSize="4xl">Settings</Heading>
          <Text>Press Save settings at the end to save</Text>
        </Box>
        <FormControl id="title">
          <FormLabel>Title</FormLabel>
          <Input defaultValue="title.." />
        </FormControl>
        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Input defaultValue="description.." />
        </FormControl>
      </Stack>
      <Flex justify="center" py="4" px={{ base: "4", md: "6" }}>
        <Button type="submit">Save Settings</Button>
      </Flex>
    </Box>
  );
};

export default DashboardSettings;
