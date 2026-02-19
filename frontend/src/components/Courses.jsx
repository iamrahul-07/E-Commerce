import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">

      {/* Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-100 w-64 p-5 fixed md:static h-full z-20 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center mb-10 mt-16 md:mt-0">
          <img
            src="/logo.webp"
            alt="Profile"
            className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
          />
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center text-sm sm:text-base">
                <RiHome2Fill className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500 text-sm sm:text-base">
                <FaDiscourse className="mr-2" /> Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center text-sm sm:text-base">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <button className="flex items-center text-sm sm:text-base" onClick={handleLogout}>
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to={"/login"} className="flex items-center text-sm sm:text-base">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-white p-4 sm:p-6 md:p-10 md:ml-0">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
          <h1 className="text-lg sm:text-xl font-bold">Courses</h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-3 sm:px-4 py-2 h-9 sm:h-10 text-sm focus:outline-none w-full sm:w-auto"
              />
              <button className="h-9 sm:h-10 border border-gray-300 rounded-r-full px-3 sm:px-4 flex items-center justify-center">
                <FiSearch className="text-lg sm:text-xl text-gray-600" />
              </button>
            </div>

            <FaCircleUser className="text-3xl sm:text-4xl text-blue-600" />
          </div>
        </header>

        {/* Courses */}
        <div className="overflow-y-auto h-[75vh] pr-1">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image?.url}
                    alt={course.title}
                    className="rounded mb-4 w-full h-40 object-contain"
                  />

                  <h2 className="font-bold text-base sm:text-lg mb-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>

                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <span className="font-bold text-lg sm:text-xl">
                      ₹{course.price}{" "}
                      <span className="text-gray-500 line-through text-sm">
                        999
                      </span>
                    </span>

                    <span className="text-green-600 text-sm">
                      {Math.round(((999 - course.price) / 999) * 100)}% off
                    </span>
                  </div>

                  <Link
                    to={`/buy/${course._id}`}
                    className="block text-center bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300 text-sm sm:text-base"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Courses;
