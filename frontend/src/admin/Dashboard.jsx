import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("admin");
      toast.success(response?.data?.message);
      navigate("/admin/login");
    } catch (error) {
      toast.error(
        error.response?.data?.errors || "Error in logging out"
      );
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 sm:p-5 flex-shrink-0">
        <div className="flex items-center flex-col mb-8 sm:mb-10">
          <img
            src="/logo.webp"
            alt="Profile"
            className="rounded-full h-16 w-16 sm:h-20 sm:w-20"
          />
          <h2 className="text-base sm:text-lg font-semibold mt-3 sm:mt-4 text-center">
            I'm Admin
          </h2>
        </div>

        <nav className="flex flex-col space-y-3 sm:space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded text-sm sm:text-base">
              Our Courses
            </button>
          </Link>

          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded text-sm sm:text-base">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm sm:text-base">
              Home
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-sm sm:text-base"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 text-lg sm:text-xl font-semibold text-center">
        Welcome!!!
      </div>
    </div>
  );
};

export default Dashboard;
