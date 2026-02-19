import mongoose, { Schema } from "mongoose";

const purchaseSchema=new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    courseId:{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }
})

export const Purchase=new mongoose.model("Purchase", purchaseSchema)