import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "./Navbar";
import { instance } from "../config";
import Projects from "./Projects";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const resonse = await instance.get(`/auth/check`);
      console.log(resonse);
      console.log(resonse.data);
      if (!resonse.data) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Navbar />
      <Projects />
    </div>
  );
};

export default Home;
