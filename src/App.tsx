import { Center, Spinner } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { userCollection } from "./firebase/collections";
import { auth } from "./firebase/config";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { AboutPage } from "./screen/AboutPage";
import { DashboardPage } from "./screen/DashboardPage";
import ExploreStudentPage from "./screen/ExploreStudentPage";
import Dashboard from "./screen/Game/Dashboard";
import DashboardIndex from "./screen/Game/DashboardIndex";
import DashboardLearn from "./screen/Game/DashboardLearn";
import DashboardPostGame from "./screen/Game/DashboardPostGame";
import DashboardPreGame from "./screen/Game/DashboardPreGame";
import DashboardSettings from "./screen/Game/DashboardSettings";
import DashboardStudents from "./screen/Game/DashboardStudents";
import { LandingPage } from "./screen/LandingPage";
import NotFoundPage from "./screen/NotFoundPage";
import RootPage from "./screen/RootPage";
import { StudentLoginPage } from "./screen/StudentLoginPage";
import Take from "./screen/Take/Take";
import TakeIndex from "./screen/Take/TakeIndex";
import { TeacherLoginPage } from "./screen/TeacherLoginPage";
import { selectAuth, setLoading, setUser } from "./store/reducer/auth";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(selectAuth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        dispatch(setLoading(true));
        if (user) {
          const userRef = doc(userCollection, user.uid);
          const userDoc = await getDoc(userRef);
          dispatch(setUser(userDoc.data()));
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    });
    return unsubscribe;
  }, []);

  if (loading && !location.pathname.includes("login")) {
    return (
      <Center flexDir="column" minH="100vh">
        <Center flexGrow={1}>
          <Spinner />
        </Center>
      </Center>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          element={
            <ProtectedRoute redirectPath="/landing" isAllowed={!!user} />
          }
        >
          <Route path="/t" element={<DashboardPage />} />
          <Route path="/s" element={<ExploreStudentPage />} />
        </Route>

        <Route path="/" element={<RootPage />} />

        <Route element={<ProtectedRoute isAllowed={!user} />}>
          <Route path="/landing" element={<LandingPage />} />
        </Route>

        <Route path="/about" element={<AboutPage />} />

        <Route path="/g/:id" element={<Dashboard />}>
          <Route path="/g/:id" element={<DashboardIndex />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="pre-game" element={<DashboardPreGame />} />
          <Route path="post-game" element={<DashboardPostGame />} />
          <Route path="learn" element={<DashboardLearn />} />
          <Route path="students" element={<DashboardStudents />} />
        </Route>

        <Route path="/t/:id" element={<Take />}>
          <Route path="/t/:id" element={<TakeIndex />} />
        </Route>

        <Route element={<ProtectedRoute redirectPath="/" isAllowed={!user} />}>
          <Route path="/t/login" element={<TeacherLoginPage />} />
          <Route path="/s/login" element={<StudentLoginPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
