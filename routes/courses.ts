import express from 'express';
import coursesController from '../controller/courses';
import { isLoggedIn } from '../middleware/auth';

const router= express.Router();
router.get('/', coursesController.getIndex);
router.get('/courses',isLoggedIn, coursesController.getUnEnrolledCourses);
router.get('/enrolled-courses',isLoggedIn, coursesController.getEnrolledCourses);
router.post('/enroll',isLoggedIn,coursesController.enrollCourse);
router.post('/unenroll',isLoggedIn,coursesController.unEnrollCourse);

export default router;