import { Course } from "../models/course.models.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;
  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No file uploaded." });
    }
    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only png and jpg are Allowed." });
    }
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error in Uploading file to Cloudinary" });
    }
    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response?.public_id,
        url: cloud_response?.secure_url,
      },
      creatorId: adminId,
    };
    const course = await Course.create(courseData);
    return res
      .status(200)
      .json({ message: "Course Created Successfully", course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: "Error in Creating Course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;
  try {
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res
        .status(404)
        .json({ errors: "Can't Update, Created by Other Admin" });
    }
    if (req.files && req.files.image) {
      const image = req.files.image;

      const cloud_response = await cloudinary.uploader.upload(
        image.tempFilePath,
      );

      course.image = {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      };
    }

    // ✅ Update other fields
    course.title = title;
    course.description = description;
    course.price = price;

    await course.save();

    return res
      .status(201)
      .json({ message: "Course Updated successfully", course });
  } catch (error) {
    return res.status(400).json({ errors: "Error in updating course" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res
        .status(400)
        .json({ errors: "Can't delete, Created by Other Admin" });
    }
    return res.status(201).json({ message: "Course Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ errors: "Error in deleting Course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.status(201).json({ courses });
  } catch (error) {
    return res.status(500).json({ errors: "Error in getting courses" });
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    return res.status(201).json({ course });
  } catch (error) {
    return res.status(500).json({ errors: "Error in getting course details" });
  }
};

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this Course" });
    }
    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${courseId}`,
    };
    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      courseId,
    });
  } catch (error) {
    return res.status(401).json({ errors: "Error in Course buying" });
  }
};

export const verifyPayment = async (req, res) => {
  const { userId } = req;

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
  } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ errors: "Invalid payment signature" });
    }
    const user = await User.findById(userId);
    // ✅ Get course price
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    // ✅ Save Order details
    const order = await Order.create({
      name: user?.firstName + " " + user?.lastName,
      email: user?.email, // optional if stored
      userId,
      courseId,
      paymentId: razorpay_payment_id,
      amount: course.price,
      status: "success",
    });

    // ✅ Save Purchase
    await Purchase.create({
      userId,
      courseId,
    });

    return res.status(200).json({
      message: "Payment verified & course unlocked",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: "Error verifying payment" });
  }
};
