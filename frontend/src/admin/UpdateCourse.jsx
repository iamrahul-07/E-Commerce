import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCourse = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/course/${id}`,
          { withCredentials: true }
        );

        setTitle(data?.course?.title);
        setDescription(data?.course?.description);
        setPrice(data?.course?.price);
        setImage(data?.course?.image?.url);
        setImagePreview(data?.course?.image?.url);
      } catch (error) {
        toast.error("Failed to fetch course Data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    if (image instanceof File) {
      formData.append("image", image);
    }

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(
        response?.data?.message ||
          "Course Updated Successfully"
      );

      navigate("/admin/our-courses");
    } catch (error) {
      toast.error(error?.response?.data?.errors);
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
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6">
      <Link
        className="inline-block bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300 text-sm sm:text-base"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 border rounded-lg shadow-lg mt-4">
        <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
          Update Course
        </h3>

        <form
          onSubmit={handleUpdateCourse}
          className="space-y-5 sm:space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-base sm:text-lg">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base sm:text-lg">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base sm:text-lg">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base sm:text-lg">
              Course Image
            </label>

            <div className="flex items-center justify-center">
              <img
                src={
                  imagePreview
                    ? `${imagePreview}`
                    : "/imgPL.webp"
                }
                alt="Course"
                className="w-full max-w-xs sm:max-w-sm h-auto rounded-md object-cover"
              />
            </div>

            <input
              type="file"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm sm:text-base"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;