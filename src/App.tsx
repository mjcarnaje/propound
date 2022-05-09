import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./screen/IndexPage";
import { StudentLoginPage } from "./screen/StudentLoginPage";
import { TeacherLoginPage } from "./screen/TeacherLoginPage";
import { store } from "./store/store";

function App() {
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
