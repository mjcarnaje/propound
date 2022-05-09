import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { userCollection } from "./firebase/collections";
import { auth } from "./firebase/config";
import { IndexPage } from "./screen/IndexPage";
import { StudentLoginPage } from "./screen/StudentLoginPage";
import { TeacherLoginPage } from "./screen/TeacherLoginPage";
import { setUser } from "./store/reducer/auth";
import { store } from "./store/store";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(userCollection, user.uid);
        const userDoc = await getDoc(userRef);
        store.dispatch(setUser(userDoc.data()));
      } else {
        navigate("/t/login");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/t/login" element={<TeacherLoginPage />} />
        <Route path="/s/login" element={<StudentLoginPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
