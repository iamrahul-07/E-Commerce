import express from 'express'
import dotenv from 'dotenv'
import {dbConnect} from './config/db.js'
import courseRoute from './routes/course.routes.js'
import userRoute from './routes/user.routes.js'
import adminRoute from './routes/admin.routes.js'
import {v2 as cloudinary} from 'cloudinary';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser'
import cors from "cors";

dotenv.config();
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"],
}))

const PORT=process.env.PORT || 3000;
dbConnect();

app.get('/', (req, res)=>{
    res.status(200).json({status : "Server Running"});
})

app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);

//Cloudinary configuration

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})