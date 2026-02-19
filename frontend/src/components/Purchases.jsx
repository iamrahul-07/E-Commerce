import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../utils/utils.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";

const Purchases = () => {
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch purchases
  useEffect(() => {
    const fetchPurchase = async () => {
      if (!token) {
        setErrorMessage("Login to Buy the course");
        return;
      }
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchased`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to Purchase data");
      }
    };
    fetchPurchase();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <div className="flex items-center mb-10 mt-16 md:mt-0">
            <img
              src="/logo.webp"
              alt="Profile"
              className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
            />
          </div>

          <ul className="mt-6 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center text-sm sm:text-base">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center text-sm sm:text-base">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500 text-sm sm:text-base">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center text-sm sm:text-base">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center text-sm sm:text-base">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <HiX className="text-xl sm:text-2xl" />
        ) : (
          <HiMenu className="text-xl sm:text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-lg sm:text-xl font-semibold mt-16 md:mt-0 mb-6">
          My Purchases
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4 text-sm sm:text-base">
            {errorMessage}
          </div>
        )}

        {purchase.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {purchase.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
              >
                <img
                  className="w-full h-44 sm:h-52 md:h-56 object-contain bg-gray-100 p-4"
                  src={item.image?.url || "https://via.placeholder.com/300"}
                  alt={item.title}
                />

                <div className="p-4 sm:p-5 text-center">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-xs sm:text-sm mb-3">
                    {item.description?.length > 100
                      ? item.description.slice(0, 100) + "..."
                      : item.description}
                  </p>

                  <p className="text-green-600 font-bold mb-4 text-sm sm:text-base">
                    ₹{item.price} only
                  </p>

                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition duration-200 mb-2 text-sm sm:text-base">
                    View
                  </button>

                  <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md transition duration-200 text-sm sm:text-base">
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">
            You have no purchases yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Purchases;
