import express from "express";
import adminController from "../controller/admin";
import { check } from "express-validator";
import { isAdmin } from "../middleware/auth";

const router = express.Router();
const levelValidator = (value: any) => {
  if (
    value.trim() !== "" &&
    value !== "INTERMEDIATE" &&
    value !== "BEGINNER" &&
    value !== "ADVANCED"
  ) {
    throw new Error("Level should be Beginner, Intermediate or Advanced");
  }
  return true;
};

router.get("/",isAdmin, adminController.getCourses);

router.get("/add-course",isAdmin, adminController.getAddCourse);

router.get("/edit-course/:id", isAdmin,adminController.getAddCourse);

router.post(
  "/add-course",
  isAdmin,
  check("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
  check("author").trim().isLength({ min: 1 }).withMessage("Author is required"),
  check("level").toUpperCase().custom(levelValidator),
  adminController.addCourse
);

router.post(
  "/edit-course",
  isAdmin,
  check("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
  check("author").trim().isLength({ min: 1 }).withMessage("Author is required"),
  check("level").toUpperCase().custom(levelValidator),
  adminController.editCourse
);
router.post("/delete-course",isAdmin, adminController.deleteCourse);

export default router;
