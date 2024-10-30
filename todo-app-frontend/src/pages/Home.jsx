import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import UserContext from "../UserContex";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Projects />
    </div>
  );
};

export default Home;
