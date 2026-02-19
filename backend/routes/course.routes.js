import express from 'express'
import { buyCourses, courseDetails, createCourse, deleteCourse, getCourses, verifyPayment } from '../controllers/course.controllers.js';
import { updateCourse } from '../controllers/course.controllers.js';
import userMiddleware from '../middleware/user.mid.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router=express.Router();

router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);
router.get("/courses", getCourses);
router.get("/:courseId", courseDetails)

router.post("/buy/:courseId", userMiddleware, buyCourses);
router.post("/verify-payment", userMiddleware, verifyPayment);


export default router;