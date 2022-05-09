import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./screen/IndexPage";
import { StudentLoginPage } from "./screen/StudentLoginPage";
import { TeacherLoginPage } from "./screen/TeacherLoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/t/login" element={<TeacherLoginPage />} />
      <Route path="/s/login" element={<StudentLoginPage />} />
    </Routes>
  );
}

export default App;
