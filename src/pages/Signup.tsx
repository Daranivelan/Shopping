import React, { useContext, useState } from "react";
import { icons } from "../utils/Icons";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../utils/Routes";
import {
  facebookLogin,
  googleSignIn,
  signup,
} from "../core/services/AuthService";
import { ShowSnackBar } from "../components/common/ShowSnackBar";
import { SnackBarContext } from "../store/SnackBarContext";
import { themeColors } from "../utils/Colors";
import { sendEmailVerification } from "firebase/auth";

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [_, dispatch] = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    // Handle signup logic here
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      ShowSnackBar({
        dispatch,
        color: themeColors.errorColor,
        message: "Please fill all the fields",
      });
      return;
    }
    if (password !== confirmPassword) {
      ShowSnackBar({
        dispatch,
        color: themeColors.errorColor,
        message: "Passwords do not match",
      });
      return;
    }
    if (password.length < 6) {
      ShowSnackBar({
        dispatch,
        color: themeColors.errorColor,
        message: "Password must be at least 6 characters",
      });
      return;
    }
    const user = await signup(name.trim(), email.trim(), password);
    if (user) {
      await sendEmailVerification(user);
      ShowSnackBar({
        dispatch,
        color: themeColors.primary,
        textColor: themeColors.yellow,
        message: "Email Verifcation sent",
      });
      navigate(routes.login);
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
          Sign Up
        </h2>
        <form onSubmit={handleSignup}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            />
          </div>

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
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600"
          >
            {isLoading ? "Loading..." : "Sign Up"}
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

        {/* Link to Login */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to={routes.login}
            className="text-yellow-500 hover:text-yellow-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
