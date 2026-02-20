import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils.js";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      localStorage.setItem(
        "admin",
        JSON.stringify({
          ...response?.data?.admin,
          token: response?.data?.token,
        })
      );

      navigate("/admin/dashboard");
      window.location.reload();
    } catch (error) {
      setErrorMessage(error?.response?.data?.errors || "Login failed!!!");
    }
  };

  return (
    <div className="bg-linear-to-r from-black to-blue-950 min-h-screen">
      <div className="min-h-screen max-w-7xl mx-auto flex items-center justify-center text-white px-4 sm:px-6">

        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 gap-3 sm:gap-0">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <Link
              to={"/"}
              className="text-lg sm:text-xl font-bold text-orange-500"
            >
              SkillCart
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to={"/signup"}
              className="bg-transparent border border-gray-500 text-xs sm:text-sm md:text-md py-1 px-3 sm:py-2 sm:px-4 rounded-md"
            >
              Signup
            </Link>

            <Link
              to={"/courses"}
              className="bg-orange-500 text-xs sm:text-sm md:text-md py-1 px-3 sm:py-2 sm:px-4 rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md mt-24 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Welcome to{" "}
            <span className="text-orange-500">SkillCart</span>
          </h2>

          <p className="text-center text-gray-400 text-sm sm:text-base mb-6">
            Login to Access Admin Dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-gray-400 text-sm sm:text-base mb-2 block"
              >
                Email
              </label>

              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="text-gray-400 text-sm sm:text-base mb-2 block"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />

                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center text-sm">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-6 rounded-md transition text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
