import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import React, { useContext, useState } from "react";
import { instance } from "../config";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContex";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [passWordMismathError, setPasswordMismatchError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const { user, setUser } = useContext(UserContext);

  const handleAuth = async (e) => {
    e.preventDefault();
    const userCredentials = {
      username,
      password,
    };
    if (isLogin) {
      if (!validateUsername(username) || !validatePassword(password)) {
        return;
      }
      try {
        const response = await instance.post(
          `/auth/authenticate`,
          userCredentials
        );
        console.log(response.data);
        if (response.data) {
          setLoginError(null);
          setUser(response.data);
          navigate("/");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        if (error.response && error.response.data) {
          setLoginError(error.response.data);
        } else {
          setLoginError("An error occurred during authentication.");
        }
      }
    } else {
      if (!validateUsername(username) || !validatePassword(password)) {
        return;
      }
      if (password !== confirmPassword) {
        setPasswordMismatchError("Password mismatch");
        return;
      } else {
        setPasswordMismatchError(null);
      }
      try {
        const response = await instance.post(`/auth/register`, userCredentials);
        console.log(response.data);
        if (response.data) {
          setLoginError(null);
          console.log(response.data);
          setUser(response.data);
          navigate("/");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        if (error.response && error.response.data) {
          setRegisterError(error.response.data);
        } else {
          setRegisterError("An error occurred during authentication.");
        }
      }
    }
  };

  const validatePassword = () => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password) && !isLogin) {
      setPasswordError(
        "Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  };

  const validateUsername = () => {
    if (username.length < 3) {
      setUsernameError("Username is too small");
      return false;
    } else if (username.length > 30) {
      setUsernameError("Username is too large");
      return false;
    } else {
      setUsernameError(null);
      return true;
    }
  };

  return (
    <div className="flex flex-col justify-start pt-32 h-screen items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-10">
        <form onSubmit={handleAuth}>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Login" : "Register"}
          </h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {usernameError && (
              <p className="text-red-600 ps-2 text-sm ">{usernameError}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {loginError && (
              <p className="text-red-600 ps-2 text-sm ">{loginError}</p>
            )}
            {passwordError && (
              <p className="text-red-600 ps-2 text-sm ">{passwordError}</p>
            )}
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {passWordMismathError && (
                <p className="text-red-600 ps-2 text-sm ">
                  {passWordMismathError}
                </p>
              )}
              {registerError && (
                <p className="text-red-600 ps-2 text-sm ">{registerError}</p>
              )}
            </div>
          )}
          <p className="mt-4 text-center pb-5 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
