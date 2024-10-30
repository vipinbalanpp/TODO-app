import React, { useContext, useEffect } from "react";
import AuthForm from "../components/AuthForm";
import Navbar from "../components/Navbar";
import UserContext from "../UserContex";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <Navbar />
      <AuthForm />
    </>
  );
};
