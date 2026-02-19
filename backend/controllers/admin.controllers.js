import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import z from 'zod';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.models.js";
import { Admin } from "../models/admin.model.js";


dotenv.config();


export const signup=async (req, res)=>{
    const {firstName, lastName, email, password}=req.body;
    const adminSchema=z.object({
        firstName: z.string().min(3,{message:"FirstName should be minimum 3 char long"}),
        lastName: z.string().min(3,{message:"lastName should be minimum 3 char long"}),
        email: z.string().email({message: "Enter valid Email"}),
        password: z.string().min(7,{message:"Password length should be greater than 7"}),
    });
     const validateData=adminSchema.safeParse(req.body);
     if(!validateData.success){
        return res.status(400).json({errors: validateData.error.issues.map(err=>err.message)});
     }
    try {
        const existingAdmin=await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message: "User already exist."})
        }
        const hashedPassword=await bcrypt.hash(password, 10);
        const newAdmin=new Admin({firstName, lastName, email, password: hashedPassword});
        await newAdmin.save();
        newAdmin.password=undefined;
        return res.status(201).json({message: "Admin Created Successfully.", newAdmin});
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
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({errors:"Admin Not Found"});
        }
        const isPasswordCorrect=await bcrypt.compare(password, admin.password);
        if(!isPasswordCorrect){
            return res.status(400).json({errors: "Incorrect Password"})
        }
        const token=jwt.sign({id: admin._id}, process.env.JWT_ADMIN_PASSWORD,{expiresIn: "1d"});
        const cookieOptions={
            expires: new Date(Date.now() + 24*60*60 *1000), //1 Day
            httpOnly: true,
            secure: process.env.NODE_ENV==="production",   //true for https only
            sameSite: "Lax"
        }
        admin.password=undefined;
        res.cookie("jwt", token, cookieOptions);
        return res.status(201).json({message: "Login Successfully",token, admin});
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