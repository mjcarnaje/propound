import { Center, Spinner } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ActivitySummaryPage } from "./feature/student/ActivitySummaryPage";
import { TeacherDashboardPage } from "./feature/teacher/TeacherDashboardPage";
import { userCollection } from "./firebase/collections";
import { auth } from "./firebase/config";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { AboutPage } from "./screen/AboutPage";
import Dashboard from "./screen/CreateActivity/Dashboard";
import DashboardIndex from "./screen/CreateActivity/DashboardIndex";
import DashboardLearn from "./screen/CreateActivity/DashboardLearn";
import DashboardPostGame from "./screen/CreateActivity/DashboardPostGame";
import DashboardPreGame from "./screen/CreateActivity/DashboardPreGame";
import DashboardSettings from "./screen/CreateActivity/DashboardSettings";
import DashboardStudents from "./screen/CreateActivity/DashboardStudents";
import CreateLearningSpace from "./screen/CreateLearningSpace";
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
          const userRef = doc(userCollection, user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          if (userData) {
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
          <Route path="/dashboard" element={<TeacherDashboardPage />} />
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
          <Route path="pre-game" element={<DashboardPreGame />} />
          <Route path="post-game" element={<DashboardPostGame />} />
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
