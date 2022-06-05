import {
  Box,
  Center,
  Container,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CustomSelect, Option } from "../../components/CustomSelect";
import GameCode from "../../components/game/GameCode";
import { Navbar } from "../../components/navbar";
import {
  gameCollection,
  gameSubCollection,
  userCollection,
} from "../../firebase/collections";
import { useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../store/reducer/auth";
import { AcitivityDocType, GameStudentDocType } from "../../types/game";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user } = useAppSelector(selectAuth);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AcitivityDocType>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [tabIndex, setTabIndex] = useState(0);

  async function getGameData() {
    try {
      setLoading(true);
      const gameRef = doc(gameCollection, id);
      const gameDoc = await getDoc(gameRef);
      if (gameDoc.exists()) {
        setData(gameDoc.data());
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function joinGame() {
    try {
      setLoading(true);
      const gameRef = doc(gameCollection, id);

      const gameDoc = await getDoc(gameRef);

      if (gameDoc.exists()) {
        const game = gameDoc.data();
        if (game.studentIds.some((uid) => uid === user.uid)) {
          toast({
            title: "You are already in this game",
            description: "",
            status: "error",
          });
          navigate(`${location.pathname}`);
          return;
        }

        const userRef = doc(userCollection, user.uid);

        await updateDoc(userRef, {
          enrolledGames: [...user.enrolledGames, game.id],
        });

        await updateDoc(gameRef, {
          studentIds: [...game.studentIds, user.uid],
        });

        await setDoc(
          doc(gameSubCollection<GameStudentDocType>(id, "student"), user.uid),
          {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            result: null,
          }
        );
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err.message,
        status: "error",
      });
    }
  }

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const code = search.get("code");

    if (code) {
      if (user.createdGames.includes(id)) {
        navigate(`/g/${id}`);
        return;
      }
      if (user.role === "TEACHER") {
        toast({
          title: "You can't join a game as a teacher",
          description: "",
          status: "error",
        });
        return;
      }
      joinGame();
    } else {
      getGameData();
    }
  }, [id]);

  if (!user || user.role !== "TEACHER") {
    return <Navigate to="/s/login" replace />;
  }

  const links = [
    {
      label: "Pre-game",
      to: `/g/${id}/pre-game`,
    },
    {
      label: "Learn",
      to: `/g/${id}/learn`,
    },
    {
      label: "Post-game",
      to: `/g/${id}/post-game`,
    },
    {
      label: "Students",
      to: `/g/${id}/students`,
    },
  ];

  return (
    <Box as="section" h="1px" minH="100vh">
      <Navbar />
      <Container py={8} minH="calc(100vh - 86px)" h="1px" maxW="container.xl">
        <Container>
          <Stack spacing="5">
            <Stack
              spacing="4"
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
            >
              <Box>
                <Text fontSize="lg" fontWeight="medium">
                  {data?.name}
                </Text>
                <Text color="muted" fontSize="sm">
                  {data?.instruction}
                </Text>
              </Box>
              <Stack alignItems="center" direction="row">
                {data && <GameCode gameId={data.id} code={data.code} />}
              </Stack>
            </Stack>
            {isMobile ? (
              <CustomSelect>
                {links.map((link) => (
                  <Option
                    onClick={() => navigate(link.to)}
                    value={link.label}
                    key={link.label}
                  />
                ))}
              </CustomSelect>
            ) : (
              <Tabs variant="enclosed">
                <TabList>
                  {links.map((link) => (
                    <Tab onClick={() => navigate(link.to)} key={link.label}>
                      {link.label}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            )}
          </Stack>
          <Center>
            <Outlet />
          </Center>
        </Container>
      </Container>
    </Box>
  );
};

export default Dashboard;
