import {
  AspectRatio,
  Avatar,
  Center,
  HStack,
  Image,
  Text,
  VStack,
} from "native-base";
import React from "react";
import BaseScreen from "../components/BaseScreen";
import SvgProPound from "../components/svgs/ProPound";

const AboutScreen = () => {
  return (
    <BaseScreen isScrollable>
      <VStack w="90%" space={8} alignItems="center" alignSelf="center">
        <AspectRatio ratio={251 / 84} h="80px">
          <SvgProPound />
        </AspectRatio>

        <VStack space={4}>
          <Text color="#ED8936" fontSize={24} fontFamily="Inter-Bold">
            About proPound
          </Text>
          <Text
            fontFamily="Inter-Regular"
            color="muted.800"
            textAlign="justify"
          >
            Propound is a game-based learning web and mobile application, a
            research product of John Paul Carnaje and Kim Kim Joy Zagado that
            aims to assist learning through game-based activities. Its main
            objective is to be a medium of fun learning in Civil Technology
            course. Game-based learning is a type of game play with defined
            learning outcomes (Shaffer, Halverson, Squire, & Gee, 2005).
            Game-based learning prompts the attention and the motivation of
            students to learn. The most frequently mentioned feature of games is
            their ability to motivate learners. The premise is that through a
            variety of motivational game features, games for enjoyment have been
            found to drive learners to stay engaged for lengthy periods of time
            (Plass, et al., 2015). Through game-based activities, propound
            yearns to provide a fun learning environment as research shows that
            having fun while learning provides unique cognitive resources,
            correlates reward and pleasure with information, strengthens and
            broadens memory networks, and switches between two basic brain modes
            — diffused mind-wandering and focused attention (Shukla, 2020).
          </Text>
        </VStack>

        <VStack space={4}>
          <Text color="#ED8936" fontSize={24} fontFamily="Inter-Bold">
            Civil Technology
          </Text>
          <Text
            fontFamily="Inter-Regular"
            color="muted.800"
            textAlign="justify"
          >
            Civil Technology covers the study and acquisition of skills with
            woodworking, carpentry, bench work operations in furniture and
            cabinet making covering basic knowledge of woodwork, functional
            knowledge of planning projects, and ability to perform woodwork
            operations. It includes simple layout work construction and
            application of simple joints, linear measurements in metric system,
            furniture design and construction and wood finishing. It also covers
            the basic knowledge in masonry, familiarization of masonry tools,
            test and measuring instruments. It also includes concrete mixture,
            work estimates, and form work. It moreover includes the study of
            metal reinforcements, plumbing and tile setting.
          </Text>
        </VStack>

        <VStack w="full" space={4}>
          <Text
            color="#ED8936"
            fontSize={24}
            fontFamily="Inter-Bold"
            textAlign="center"
          >
            Research Adviser
          </Text>
          <VStack
            alignItems="center"
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
            space={3}
          >
            <Avatar source={require("../assets/about/1.jpg")} size="xl" />
            <Text fontSize={18} fontFamily="Inter-Bold" color="#1A202C">
              Jan Vincent Leuterio
            </Text>
            <Text textAlign="center" fontFamily="Inter-Bold" color="#718096">
              Department of Techonology Teacher Education
            </Text>
            <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
              College of Education, MSU - IIT
            </Text>
          </VStack>
        </VStack>

        <VStack w="full" space={4}>
          <Text
            color="#ED8936"
            fontSize={24}
            fontFamily="Inter-Bold"
            textAlign="center"
          >
            Research Panelists
          </Text>

          <HStack
            space={2}
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
          >
            <VStack space={2} flexGrow={1}>
              <Text fontSize={16} fontFamily="Inter-Bold" color="#1A202C">
                Osuardo A. Pabatang Jr.
              </Text>
              <Text
                fontSize={13}
                textAlign="left"
                fontFamily="Inter-Medium"
                lineHeight={18}
                color="#718096"
              >
                Department of Technology{"\n"}Teacher Education
              </Text>
              <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
                College of Education, MSU - IIT
              </Text>
            </VStack>
            <Center boxSize="64px">
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                source={require("../assets/about/3.jpg")}
                alt="Alternate Text"
              />
            </Center>
          </HStack>

          <HStack
            space={2}
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
          >
            <VStack space={2} flexGrow={1}>
              <Text fontSize={16} fontFamily="Inter-Bold" color="#1A202C">
                Glay Vhincent Sumaylo
              </Text>
              <Text
                fontSize={13}
                textAlign="left"
                fontFamily="Inter-Medium"
                lineHeight={18}
                color="#718096"
              >
                Department of Technology{"\n"}Teacher Education
              </Text>
              <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
                College of Education, MSU - IIT
              </Text>
            </VStack>
            <Center boxSize="64px">
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                source={require("../assets/about/2.jpg")}
                alt="Alternate Text"
              />
            </Center>
          </HStack>
        </VStack>

        <VStack w="full" space={4}>
          <Text
            color="#ED8936"
            fontSize={24}
            fontFamily="Inter-Bold"
            textAlign="center"
          >
            The Researchers
          </Text>

          <HStack
            space={2}
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
          >
            <VStack space={2} flexGrow={1}>
              <Text fontSize={16} fontFamily="Inter-Bold" color="#1A202C">
                John Paul Carnaje
              </Text>
              <Text
                fontSize={13}
                textAlign="left"
                fontFamily="Inter-Medium"
                lineHeight={18}
                color="#718096"
              >
                Bachelor of Technology Livelihood{"\n"}Education - Industrial
                Arts
              </Text>
              <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
                College of Education, MSU - IIT
              </Text>
            </VStack>
            <Center boxSize="64px">
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                source={require("../assets/about/4.jpg")}
                alt="Alternate Text"
              />
            </Center>
          </HStack>

          <HStack
            space={2}
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
          >
            <VStack space={2} flexGrow={1}>
              <Text fontSize={16} fontFamily="Inter-Bold" color="#1A202C">
                Kim Kim Joy Zagado
              </Text>
              <Text
                fontSize={13}
                textAlign="left"
                fontFamily="Inter-Medium"
                lineHeight={18}
                color="#718096"
              >
                Bachelor of Technology Livelihood{"\n"}Education - Industrial
                Arts
              </Text>
              <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
                College of Education, MSU - IIT
              </Text>
            </VStack>
            <Center boxSize="64px">
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                source={require("../assets/about/5.jpg")}
                alt="Alternate Text"
              />
            </Center>
          </HStack>
        </VStack>

        <VStack w="full" space={4}>
          <Text
            color="#ED8936"
            fontSize={24}
            fontFamily="Inter-Bold"
            textAlign="center"
          >
            Credits
          </Text>

          <HStack
            space={2}
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
          >
            <VStack space={2} flexGrow={1}>
              <Text fontSize={16} fontFamily="Inter-Bold" color="#1A202C">
                Michael James Carnaje
              </Text>
              <Text
                fontSize={13}
                textAlign="left"
                fontFamily="Inter-Medium"
                lineHeight={18}
                color="#718096"
              >
                BS Computer Science
              </Text>
              <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
                College of Computer Studies, MSU - IIT
              </Text>
            </VStack>
            <Center boxSize="64px">
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                source={require("../assets/about/6.png")}
                alt="Alternate Text"
              />
            </Center>
          </HStack>

          <HStack
            space={2}
            bg="white"
            shadow="1"
            borderRadius="lg"
            w="full"
            p={4}
          >
            <VStack space={2} flexGrow={1}>
              <Text fontSize={16} fontFamily="Inter-Bold" color="#1A202C">
                Tristan E. Listanco
              </Text>
              <Text
                fontSize={13}
                textAlign="left"
                fontFamily="Inter-Medium"
                lineHeight={18}
                color="#718096"
              >
                Science Technology Engineering{"\n"}and Mathematics
              </Text>
              <Text fontSize={12} fontFamily="Inter-Regular" color="#4A5568">
                Senior High School, ICNHS
              </Text>
            </VStack>
            <Center boxSize="64px">
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                source={require("../assets/about/7.png")}
                alt="Alternate Text"
              />
            </Center>
          </HStack>
        </VStack>
      </VStack>
    </BaseScreen>
  );
};

export default AboutScreen;
