import { Box, Heading, Stack, Text } from "@chakra-ui/react";
// @ts-expect-error
import LandingPageSvg from "../assets/svgs/landing_page_1.svg?component";
import { MainLayout } from "../components/layout/MainLayout";

export const LandingPage = () => {
  return (
    <MainLayout unAuthenticated={true}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="calc(100vh - 86px)"
        as="section"
      >
        <Box
          maxW={{ base: "xl", md: "8xl" }}
          px={{ base: "6", md: "8" }}
          mx="auto"
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: "3rem", lg: "2rem" }}
            align={{ lg: "center" }}
            justify="space-between"
          >
            <Box w={{ base: "full", md: "40%" }} flex="1">
              <Heading
                fontFamily="Inter"
                as="h1"
                size="4xl"
                color="orange.500"
                mt="8"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                Welcome to proPound
              </Heading>
              <Text
                color="gray.600"
                mt="4"
                fontSize="xl"
                fontStyle="italic"
                fontWeight="medium"
              >
                A User-Friendly Learning Content Management System for Civil
                Technology
              </Text>
            </Box>
            <Box
              display="flex"
              w={{ base: "full", md: "60%" }}
              justifyContent="center"
              pos="relative"
            >
              <LandingPageSvg style={{ width: "90%" }} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </MainLayout>
  );
};
