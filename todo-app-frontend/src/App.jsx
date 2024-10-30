import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
import Home from "./pages/Home";
import { useContext, useEffect } from "react";
import UserContext from "./UserContex";
import { instance } from "./config";

function App() {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await instance.get(`/auth/check`);
      console.log(response);
      console.log(response.data);
      if (!response.data.isLoggedIn) {
        navigate("/login");
      } else {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/projectDetails/:title"
            element={<ProtectedRoute element={<ProjectDetails />} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
