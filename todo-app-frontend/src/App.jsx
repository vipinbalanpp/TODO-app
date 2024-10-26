import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { Login } from "./pages/Login";
import ProjectDetils from "./pages/ProjectDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projectDetials/:title" element={<ProjectDetils />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
