import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils.js";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCourses();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  // Original Slider Settings (unchanged)
  var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  responsive: [
    {
      breakpoint: 1240,
      settings: { slidesToShow: 3 }
    },
    {
      breakpoint: 1080,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 768,
      settings:{slidesToShow : 1}
    }
  ]
};


  return (
    <div className="bg-linear-to-r from-black to-blue-950">
      <div className="min-h-screen text-white container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4 md:gap-0">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.webp"
              alt=""
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer"
            />
            <h1 className="text-xl sm:text-2xl text-orange-500 font-bold">
              SkillCart
            </h1>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-xs sm:text-sm md:text-lg text-white py-2 px-3 md:px-4 border border-white rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-xs sm:text-sm md:text-base text-white py-2 px-3 md:px-4 border border-white rounded-md"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-transparent text-xs sm:text-sm md:text-base text-white py-2 px-3 md:px-4 border border-white rounded-md"
                >
                  SignUp
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main Section */}
        <section className="text-center py-12 md:py-20 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-orange-500">
            SkillCart
          </h1>

          <br />

          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Hands-on tech courses built for future developers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <Link
              to={"/courses"}
              className="bg-green-500 text-white text-sm sm:text-base rounded font-semibold hover:bg-white duration-300 hover:text-black py-2 sm:py-3 px-4 sm:px-6 w-full sm:w-auto"
            >
              Explore Courses
            </Link>

            <Link
              to={"https://www.youtube.com/results?search_query=codewithharry"}
              className="bg-white text-black text-sm sm:text-base rounded font-semibold hover:bg-green-500 duration-300 hover:text-white py-2 sm:py-3 px-4 sm:px-6 w-full sm:w-auto"
            >
              Courses Videos
            </Link>
          </div>
        </section>

        {/* Slider Section */}
        <section>
          {mounted && (
            <Slider {...settings}>
              {courses.map((course) => {
                return (
                  <div key={course._id} className="px-2 sm:px-4">
                    <div className="relative px-2 transition-transform duration-300 transform hover:scale-105">
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        <img
                          src={course.image?.url}
                          alt=""
                          className="h-32 sm:h-40 md:h-48 w-full object-contain"
                        />

                        <div className="p-4 sm:p-6 text-center">
                          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">
                            {course.title}
                          </h2>

                          <Link
                            to={`/buy/${course._id}`}
                            className="mt-4 inline-block bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300 cursor-pointer"
                          >
                            Enroll Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </section>

        <hr />

        {/* Footer */}
        <footer className="my-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.webp"
                  alt=""
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer"
                />
                <h1 className="text-xl sm:text-2xl text-orange-500 font-bold">
                  SkillCart
                </h1>
              </div>

              <div className="mt-3 ml-0 md:ml-6">
                <p className="mb-2 text-base sm:text-lg font-semibold">
                  Follow Us
                </p>

                <div className="flex justify-center md:justify-start space-x-4">
                  <FaFacebookSquare className="text-2xl hover:text-blue-400 duration-300" />
                  <FaInstagramSquare className="text-2xl hover:text-pink-600 duration-300" />
                  <FaLinkedin className="text-2xl hover:text-blue-600 duration-300" />
                </div>
              </div>
            </div>

            {/* Connect Section */}
            <div className="items-center md:items-start flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold md:mb-4">
                Connects
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Youtube-Learn Coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  GitHub-Learn Coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  LeetCode-Learn Coding
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div className="items-center md:items-start flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold mb-4">
                Copyrights &#169; 2026
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
