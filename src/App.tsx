import { Center, Spinner } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { userCollection } from "./firebase/collections";
import { auth } from "./firebase/config";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { AboutPage } from "./screen/AboutPage";
import { DashboardPage } from "./screen/DashboardPage";
import Dashboard from "./screen/Game/Dashboard";
import DashboardLearn from "./screen/Game/DashboardLearn";
import DashboardPostGame from "./screen/Game/DashboardPostGame";
import DashboardPreGame from "./screen/Game/DashboardPreGame";
import DashboardStudents from "./screen/Game/DashboardStudents";
import { LandingPage } from "./screen/LandingPage";
import { StudentLoginPage } from "./screen/StudentLoginPage";
import { TeacherLoginPage } from "./screen/TeacherLoginPage";
import { selectAuth, setLoading, setUser } from "./store/reducer/auth";

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
        <Navbar />
        <Center flexGrow={1}>
          <Spinner />
        </Center>
      </Center>
    );
  }

  return (
    <Routes>
      <Route
        element={<ProtectedRoute redirectPath="/landing" isAllowed={!!user} />}
      >
        <Route path="/" element={<DashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute isAllowed={!user} />}>
        <Route path="/landing" element={<LandingPage />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />

      <Route path="/g/:id" element={<Dashboard />}>
        <Route path="pre-game" element={<DashboardPreGame />} />
        <Route path="post-game" element={<DashboardPostGame />} />
        <Route path="learn" element={<DashboardLearn />} />
        <Route path="students" element={<DashboardStudents />} />
      </Route>

      <Route element={<ProtectedRoute redirectPath="/" isAllowed={!user} />}>
        <Route path="/t/login" element={<TeacherLoginPage />} />
        <Route path="/s/login" element={<StudentLoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
