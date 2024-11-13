import React, { useContext, useState } from "react";
import { icons } from "../utils/Icons";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../utils/Routes";
import {
  facebookLogin,
  googleSignIn,
  login,
} from "../core/services/AuthService";
import { ShowSnackBar } from "../components/common/ShowSnackBar";
import { SnackBarContext } from "../store/SnackBarContext";
import { themeColors } from "../utils/Colors";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_, dispatch] = useContext(SnackBarContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const response = await login(email, password);
    if (response === null) {
      ShowSnackBar({
        dispatch,
        color: themeColors.errorColor,
        message: "Invalid email or password",
      });
      return;
    }
    if (response != null) {
      if (response.emailVerified) {
        ShowSnackBar({
          dispatch,
          color: themeColors.success,
          message: "Login Successful",
        });
        navigate(routes.home);
        return;
      }
      ShowSnackBar({
        dispatch,
        color: themeColors.errorColor,
        message: "Please verify your email address before logging in.",
      });
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    const response = await googleSignIn();
    if (response) {
      navigate(routes.home);
    }
  };

  const handleFacebookLogin = async () => {
    const response = await facebookLogin();
    if (response) {
      navigate(routes.home);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={() => {}}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-2 justify-center mt-4">
          <img
            onClick={handleGoogleLogin}
            src={icons.google}
            className="cursor-pointer"
          />
          <img
            onClick={handleFacebookLogin}
            src={icons.facebook}
            className="cursor-pointer"
          />
        </div>
        {/* Link to Signup */}
        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to={routes.signup}
            className="text-yellow-500 hover:text-yellow-600 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
