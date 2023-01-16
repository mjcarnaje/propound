import {
  AspectRatio,
  Avatar,
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import image01 from "../assets/about/1.jpg";
import image02 from "../assets/about/2.jpg";
import image03 from "../assets/about/3.jpg";
import image04 from "../assets/about/4.jpg";
import image05 from "../assets/about/5.jpg";
import image06 from "../assets/about/6.png";
import image07 from "../assets/about/7.png";
import CEDLogo from "../assets/images/CED logo.png";
import MSUIITLogo from "../assets/images/MSU-IIT logo.png";
import { MainLayout } from "../components/layout/MainLayout";

export const AboutPage = () => {
  return (
    <MainLayout unAuthenticated={true}>
      <Container as="section" py={24} maxW="container.xl">
        <VStack spacing={12}>
          <Box>
            <Heading
              fontFamily="Inter"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="extrabold"
              letterSpacing="wide"
              color="orange.400"
              fontSize="3xl"
              mb={2}
            >
              About proPound
            </Heading>
            <Text fontSize="lg" textAlign="justify" lineHeight="1.7">
              Propound is a game-based learning web and mobile application, a
              research product of John Paul Carnaje and Kim Kim Joy Zagado that
              aims to assist learning through game-based activities. Its main
              objective is to be a medium of fun learning in Civil Technology
              course. Game-based learning is a type of game play with defined
              learning outcomes (Shaffer, Halverson, Squire, & Gee, 2005).
              Game-based learning prompts the attention and the motivation of
              students to learn. The most frequently mentioned feature of games
              is their ability to motivate learners. The premise is that through
              a variety of motivational game features, games for enjoyment have
              been found to drive learners to stay engaged for lengthy periods
              of time (Plass, et al., 2015). Through game-based activities,
              propound yearns to provide a fun learning environment as research
              shows that having fun while learning provides unique cognitive
              resources, correlates reward and pleasure with information,
              strengthens and broadens memory networks, and switches between two
              basic brain modes — diffused mind-wandering and focused attention
              (Shukla, 2020).
            </Text>
          </Box>
          <Box>
            <Heading
              fontFamily="Inter"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="extrabold"
              letterSpacing="wide"
              color="orange.400"
              fontSize="3xl"
              mb={2}
            >
              Civil Technology course
            </Heading>
            <Text fontSize="lg" textAlign="justify" lineHeight="1.7">
              Civil Technology covers the study and acquisition of skills with
              woodworking, carpentry, bench work operations in furniture and
              cabinet making covering basic knowledge of woodwork, functional
              knowledge of planning projects, and ability to perform woodwork
              operations. It includes simple layout work construction and
              application of simple joints, linear measurements in metric
              system, furniture design and construction and wood finishing. It
              also covers the basic knowledge in masonry, familiarization of
              masonry tools, test and measuring instruments. It also includes
              concrete mixture, work estimates, and form work. It moreover
              includes the study of metal reinforcements, plumbing and tile
              setting.
            </Text>
          </Box>

          <Box w="full">
            <Heading
              fontFamily="Inter"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="extrabold"
              letterSpacing="wide"
              color="orange.400"
              fontSize="3xl"
              mb={2}
            >
              Research Adviser
            </Heading>

            <HStack
              w="60%"
              mx="auto"
              p={8}
              borderRadius="md"
              shadow="sm"
              spacing={8}
              bg="white"
            >
              <Avatar size="2xl" name="Jan Vincent Leuterio" src={image01} />
              <Box>
                <Text color="grey.800" fontSize="2xl" fontWeight="bold">
                  Jan Vincent Leuterio
                </Text>
                <Text my={1} fontWeight="semibold" fontSize="sm">
                  Department of Technology Teacher Education
                </Text>
                <Text fontSize="sm" fontStyle="italic">
                  College of Education, MSU-IIT
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w="full">
            <Heading
              fontFamily="Inter"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="extrabold"
              letterSpacing="wide"
              color="orange.400"
              fontSize="3xl"
              mb={2}
            >
              Research Panelists
            </Heading>

            <HStack spacing={4}>
              {[
                {
                  name: "Osuardo A. Pabatang Jr.",
                  title: "Department of Technology Teacher Education",
                  institution: "College of Education, MSU-IIT",
                  picture: image03,
                },
                {
                  name: "Glay Vhincent Sumaylo",
                  title: "Department of Technology Teacher Education",
                  institution: "College of Education, MSU-IIT",
                  picture: image02,
                },
              ].map((researcher) => (
                <HStack
                  p={8}
                  borderRadius="md"
                  shadow="sm"
                  spacing={8}
                  bg="white"
                  flex={1}
                >
                  <Avatar
                    size="2xl"
                    name={researcher.name}
                    src={researcher.picture}
                  />
                  <VStack align="flex-start" spacing={2}>
                    <Text color="grey.800" fontSize="2xl" fontWeight="bold">
                      {researcher.name}
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      {researcher.title}
                    </Text>
                    <Text fontSize="sm" fontStyle="italic">
                      {researcher.institution}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </HStack>
          </Box>

          <Box w="full">
            <Heading
              fontFamily="Inter"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="extrabold"
              letterSpacing="wide"
              color="orange.400"
              fontSize="3xl"
              mb={2}
            >
              The Researchers
            </Heading>
            <HStack spacing={4}>
              {[
                {
                  name: "John Paul Carnaje",
                  title:
                    "Bachelor of Technology and Livelihood Education - Industrial Arts",
                  institution: "College of Education, MSU-IIT",
                  picture: image04,
                },
                {
                  name: "Kim Kim Joy Zagado",
                  title:
                    "Bachelor of Technology and Livelihood Education - Industrial Arts",
                  institution: "College of Education, MSU-IIT",
                  picture: image05,
                },
              ].map((researcher) => (
                <HStack
                  p={8}
                  borderRadius="md"
                  shadow="sm"
                  spacing={8}
                  bg="white"
                  flex={1}
                >
                  <Avatar
                    size="2xl"
                    name={researcher.name}
                    src={researcher.picture}
                  />
                  <VStack align="flex-start" spacing={2}>
                    <Text color="grey.800" fontSize="2xl" fontWeight="bold">
                      {researcher.name}
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      {researcher.title}
                    </Text>
                    <Text fontSize="sm" fontStyle="italic">
                      {researcher.institution}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </HStack>
          </Box>

          <Box w="full">
            <Heading
              fontFamily="Inter"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="extrabold"
              letterSpacing="wide"
              color="orange.400"
              fontSize="3xl"
              mb={2}
            >
              Credits
            </Heading>
            <HStack spacing={4}>
              {[
                {
                  name: "Michael James Carnaje",
                  title: " BS Computer Science",
                  institution: "College of Computer Studies, MSU - IIT",
                  picture: image06,
                },
                {
                  name: "Tristan E. Listanco",
                  title: "STEM Student",
                  institution: "Senior High School, ICNHS",
                  picture: image07,
                },
              ].map((researcher) => (
                <HStack
                  p={8}
                  borderRadius="md"
                  shadow="sm"
                  spacing={8}
                  bg="white"
                  flex={1}
                >
                  <Avatar
                    size="2xl"
                    name={researcher.name}
                    src={researcher.picture}
                  />
                  <VStack align="flex-start" spacing={2}>
                    <Text color="grey.800" fontSize="2xl" fontWeight="bold">
                      {researcher.name}
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      {researcher.title}
                    </Text>
                    <Text fontSize="sm" fontStyle="italic">
                      {researcher.institution}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </HStack>
          </Box>
        </VStack>
      </Container>

      <HStack bg="gray.100" py={16} spacing={16} justify="center">
        <AspectRatio w="124px" ratio={1}>
          <Image src={CEDLogo} />
        </AspectRatio>
        <AspectRatio w="124px" ratio={1}>
          <Image src={MSUIITLogo} />
        </AspectRatio>
      </HStack>
    </MainLayout>
  );
};
