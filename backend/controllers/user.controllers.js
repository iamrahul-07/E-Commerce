import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import z from 'zod';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.models.js";

dotenv.config();

export const signup=async (req, res)=>{
    const {firstName, lastName, email, password}=req.body;
    const userSchema=z.object({
        firstName: z.string().min(3,{message:"FirstName should be minimum 3 char long"}),
        lastName: z.string().min(3,{message:"lastName should be minimum 3 char long"}),
        email: z.string().email({message: "Enter valid Email"}),
        password: z.string().min(7,{message:"Password length should be greater than 7"}),
    });
     const validateData=userSchema.safeParse(req.body);
     if(!validateData.success){
        return res.status(400).json({errors: validateData.error.issues.map(err=>err.message)});
     }
    try {
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exist."})
        }
        const hashedPassword=await bcrypt.hash(password, 10);
        const newUser=new User({firstName, lastName, email, password: hashedPassword});
        await newUser.save();
        newUser.password = undefined;
        return res.status(200).json({message: "User Created Successfully.", newUser});
    } catch (error) {
        return res.status(500).json({errors : "Error in Creating Account"});
    }
}

export const login=async (req, res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).json({errors: "All fields are required"})
    }
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:"User Not Found"});
        }
        const isPasswordCorrect=await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({errors: "Incorrect Password"})
        }
        const token=jwt.sign({id: user._id}, process.env.JWT_USER_PASSWORD,{expiresIn: "1d"});
        const cookieOptions={
            expires: new Date(Date.now() + 24*60*60 *1000), //1 Day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",   //true for https only
            sameSite: "Lax"
        }
        res.cookie("jwt", token, cookieOptions);

        return res.status(200).json({message: "Login Successfully", token, user});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Login failed"});
        
    }
}

export const logout=async (req, res)=>{
    try {
        await res.clearCookie("jwt");
        return res.status(201).json({message: "Logout Successfully"});
    } catch (error) {
        return res.status(400).json({errors: "Logout failed"});
    }
}


export const purchases=async (req, res)=>{
    const {userId}=req;
    try {
        const purchased=await Purchase.find({userId});

        let purchasesCourseId=[];
        for(let i=0; i<purchased.length;i++){
            purchasesCourseId.push(purchased[i].courseId);
        }
        const courseData=await Course.find({
                _id:{$in:purchasesCourseId}
            });
        return res.status(200).json({purchased, courseData});
    } catch (error) {
        return res.status(500).json({errors: "Error in purchase"})
    }
}