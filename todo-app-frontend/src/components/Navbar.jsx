import React, { useContext } from "react";
import logo from "../assets/logo.png";
import { instance } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../UserContex";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await instance.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="p-10 cursor-pointer h-8 w-full flex items-center gap-2 justify-between border border-b-2">
      <div></div>
      <div className="flex items-center">
        <img className="h-10 w-10" src={logo} />
        <p className="text-2xl text-blue-700 font-bold">TODO APP</p>
      </div>
      <div>
        {location.pathname !== "/login" && (
          <button onClick={handleLogout} className="bg-">
            <i className="fa fa-sign-out text-red-500 text-lg font-bold hover:text-red-700 transition duration-300"></i>
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
