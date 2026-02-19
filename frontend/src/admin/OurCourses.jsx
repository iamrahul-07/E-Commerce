import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../utils/utils.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OurCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const token = admin?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(response?.data?.courses);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);

      const updatedCourses = courses.filter(
        (course) => course._id !== id
      );
      setCourses(updatedCourses);
    } catch (error) {
      toast.error(
        error?.response?.data?.errors ||
          "Error in deleting course"
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10">
        Loading...
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Our Courses
      </h1>

      <Link
        className="inline-block bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300 text-sm sm:text-base"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-md rounded-lg p-4"
          >
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-36 sm:h-40 w-full object-cover rounded-t-lg"
            />

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mt-2 text-xs sm:text-sm break-words">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>

            {/* Price */}
            <div className="flex flex-wrap justify-between items-center mt-4 text-gray-800 font-bold gap-2">
              <div className="text-sm sm:text-base">
                ₹{course.price}{" "}
                <span className="line-through text-gray-500 text-xs sm:text-sm">
                  999
                </span>
              </div>

              <div className="text-green-600 text-xs sm:text-sm">
                {Math.round(
                  ((999 - course.price) / 999) * 100
                )}{" "}
                % off
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4 gap-2">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="flex-1 text-center bg-orange-500 text-white py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
              >
                Update
              </Link>

              <button
                onClick={() =>
                  handleDeleteCourse(course._id)
                }
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCourses;
