import React from "react";
import logo from "../assets/logo.png";
import { instance } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await instance.post("/auth/logout");
      console.log(response.data);
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div className="p-10  h-8 w-full flex items-center gap-2 justify-between border border-b-2">
      <div></div>
      <div className="flex items-center">
        <img className="h-10 w-10" src={logo} />
        <p className="text-2xl text-blue-700 font-bold">TODO APP</p>
      </div>
      <div>
        {location.pathname !== "/login" && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
