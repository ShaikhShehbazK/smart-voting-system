import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../store/store";
import loginImage from "../../public/voting-image1.jpg";
import loginImage2 from "../../public/image2.webp";

export default function Login() {
  const adhaarCardNumber = useRef();
  const password = useRef();

  const { setIsLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const adhaarCardNumberValue = adhaarCardNumber.current.value;
    const passwordValue = password.current.value;
    try {
      const response = await axios.post("http://localhost:3002/login", {
        adhaarCardNumber: adhaarCardNumberValue,
        password: passwordValue,
      });
      toast.success("login Successfully");
      setIsLoggedIn(true);
      console.log("login successful:", response.data);
      navigate("/"); // Redirect to home page
      window.location.reload();
    } catch (error) {
      console.error("login error:", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error: " + error.message);
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 py-8 px-2">
      {/* Left Side: Form Card */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md md:max-w-lg flex flex-col justify-center p-8 mx-auto lg:mx-0">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Login to your E-voting account
        </p>
        <div className="w-32 md:w-40 mx-auto mb-4">
          <img
            src={loginImage2}
            alt="Login illustration"
            className="w-full h-auto object-contain"
          />
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm mb-1"
              htmlFor="adhaar"
            >
              Adhaar Card Number
            </label>
            <input
              id="adhaar"
              type="number"
              placeholder="Enter your Adhaar Card Number"
              ref={adhaarCardNumber}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              ref={password}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              onFocus={(e) => {
                e.target.readOnly = false;
              }}
              readOnly
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold p-2 rounded-lg hover:from-blue-600 hover:to-pink-600 transition-all duration-200 shadow-md mt-2"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?
          <a
            href="/signup"
            className="ml-2 text-blue-600 font-semibold underline hover:text-pink-500 transition-colors"
          >
            Signup
          </a>
        </p>
      </div>
      {/* Right Side: Illustration (hidden on small screens) */}
      <div className="hidden lg:flex flex-1 items-center justify-center ml-10">
        <img
          className="w-full max-w-2xl h-auto object-cover rounded-3xl shadow-xl"
          src={loginImage}
          alt="Voting illustration"
        />
      </div>
    </div>
  );
}
