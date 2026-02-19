import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/${courseId}`
        );
        setCourse(response.data.course);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "SkillCart",
        description: "Course Purchase",
        order_id: data.orderId,

        handler: async function (response) {
          try {
            await axios.post(
              `${BACKEND_URL}/course/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Payment Successful ");
            navigate("/purchases");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        toast.error("Payment failed ❌");
      });

    } catch (err) {
      setError(err?.response?.data?.errors || "Payment error");
      setLoading(false);
      if (err.response?.status === 400) {
        toast.error("You already purchased this course");
        navigate("/purchases");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE - Course Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 border-b md:border-b-0 md:border-r">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Order Details
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Course Name</p>
              <p className="text-base sm:text-lg font-semibold break-words">
                {course?.title}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Description</p>
              <p className="text-xs sm:text-sm text-gray-700 break-words">
                {course?.description}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Total Price</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                ₹{course?.price}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Buy Button */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
          <div className="text-center w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-6">
              Ready to Purchase?
            </h3>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base sm:text-lg font-semibold transition duration-300"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Buy;
