import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const name = useRef();
  const email = useRef();
  const mobile = useRef();
  const adhaarCardNumber = useRef();
  const password = useRef();
  const address = useRef();
  const age = useRef();
  const role = useRef();

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    const nameValue = name.current.value;
    const emailValue = email.current.value;
    const mobileValue = mobile.current.value;
    const adhaarCardNumberValue = adhaarCardNumber.current.value;
    const passwordValue = password.current.value;
    const addressValue = address.current.value;
    const ageValue = age.current.value;
    const roleValue = role.current.value;
    console.log(roleValue);

    try {
      const response = await axios.post("http://localhost:3002/signup", {
        name: nameValue,
        email: emailValue,
        mobile: mobileValue,
        adhaarCardNumber: adhaarCardNumberValue,
        password: passwordValue,
        address: addressValue,
        age: ageValue,
        role: roleValue,
      });
      toast.success("signup Successfully");
      console.log("Signup successful:", response.data);
      navigate("/"); // Redirect to home page
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: "A user with this email already exists.",
        });
      }
      if (error.response.data.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        console.error("Signup error:", error);
        toast.error("Error: " + error.response.data.message);
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200 py-8 px-2">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md md:max-w-lg lg:max-w-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Illustration (hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-400 to-pink-400 items-center justify-center p-6">
          <img
            src="https://img.freepik.com/free-vector/online-voting-concept-illustration_114360-7866.jpg?w=400"
            alt="E-voting illustration"
            className="w-48 h-48 object-contain"
          />
        </div>
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Sign up to participate in secure E-voting
          </p>
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label
                className="block text-gray-700 text-sm mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                ref={name}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-3">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm mb-1"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  placeholder="Age"
                  ref={age}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  min={18}
                />
              </div>
              <div className="flex-1 mt-3 md:mt-0">
                <label
                  className="block text-gray-700 text-sm mb-1"
                  htmlFor="mobile"
                >
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="Mobile Number"
                  ref={mobile}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm mb-1"
                htmlFor="address"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Address"
                ref={address}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
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
                placeholder="Adhaar Card Number"
                ref={adhaarCardNumber}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                minLength={12}
                maxLength={12}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                ref={email}
                onFocus={(e) => {
                  e.target.readOnly = false;
                }}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                readOnly
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
                placeholder="Password"
                ref={password}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                onFocus={(e) => {
                  e.target.readOnly = false;
                }}
                readOnly
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm mb-1"
                htmlFor="role"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                ref={role}
              >
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold p-2 rounded-lg hover:from-blue-600 hover:to-pink-600 transition-all duration-200 shadow-md mt-2"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4 text-sm">
            Already have an account?
            <a
              href="/login"
              className="ml-2 text-blue-600 font-semibold underline hover:text-pink-500 transition-colors"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
