import { Center, Spinner } from "@chakra-ui/react";
import { GameType } from "@propound/types";
import { isAuthoredDocType } from "@propound/utils";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { auth, collections } from "./firebase/config";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { AboutPage } from "./screen/AboutPage";
import { ActivitySummaryPage } from "./screen/ActivitySummaryPage";
import Dashboard from "./screen/CreateActivity/Dashboard";
import DashboardIndex from "./screen/CreateActivity/DashboardIndex";
import DashboardLearn from "./screen/CreateActivity/DashboardLearn";
import DashboardSettings from "./screen/CreateActivity/DashboardSettings";
import DashboardStudents from "./screen/CreateActivity/DashboardStudents";
import LearningSpaceGame from "./screen/CreateActivity/LearningSpaceGame";
import CreateLearningSpace from "./screen/CreateLearningSpace";
import { Dashboard as MyDashboard } from "./screen/Dashboard";
import { LandingPage } from "./screen/LandingPage";
import NotFoundPage from "./screen/NotFoundPage";
import RootPage from "./screen/RootPage";
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
          const userRef = doc(collections.users, user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          if (userData && isAuthoredDocType(userData)) {
            dispatch(setUser(userData));
          }
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
          <Route path="/dashboard" element={<MyDashboard />} />
          <Route path="/create" element={<CreateLearningSpace />} />
        </Route>

        <Route path="/" element={<RootPage />} />

        <Route element={<ProtectedRoute isAllowed={!user} />}>
          <Route path="/landing" element={<LandingPage />} />
        </Route>

        <Route path="/about" element={<AboutPage />} />

        <Route path="/g/:id" element={<Dashboard />}>
          <Route path="/g/:id" element={<DashboardIndex />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route
            path="pre-game"
            element={<LearningSpaceGame gameType={GameType.PRE_TEST} />}
          />
          <Route
            path="post-game"
            element={<LearningSpaceGame gameType={GameType.POST_TEST} />}
          />
          <Route path="learn" element={<DashboardLearn />} />
          <Route path="results" element={<DashboardStudents />} />
        </Route>

        <Route path="/activity/:id" element={<Outlet />}>
          <Route path="/activity/:id" element={<ActivitySummaryPage />} />
        </Route>

        <Route element={<ProtectedRoute redirectPath="/" isAllowed={!user} />}>
          <Route path="/login" element={<TeacherLoginPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
