import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    userId: String,
    courseId: String,
    paymentId: String,
    amount: Number,
    status: String,
  },
  { timestamps: true }
);
export const Order=mongoose.model("Order", orderSchema);