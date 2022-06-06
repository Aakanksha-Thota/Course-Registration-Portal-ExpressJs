import express from "express";
import authController from "../controller/auth";
import { check } from "express-validator";
import User from "../model/user";

const router = express.Router();
router.get("/login", authController.getLogin);

router.get("/signUp", authController.getSignUp);

router.post(
  "/signUp",
  check("userName")
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("User Name should contain 3 to 10 characters")
    .custom((value) => {
      return User.findOne({ userName: value }).then((user) => {
        if (user) {
          return Promise.reject("UserName already exists, Try different one");
        }
      });
    }),

  check(
    "password",
    "Password should contain 6 to 8 characters without special characters"
  )
    .trim()
    .isLength({ min: 6, max: 8 })
    .isAlphanumeric(),
  check("confirmPassword").custom((value, meta) => {
    if (value !== meta.req.body.password) {
      throw new Error("Password should match");
    }
    return true;
  }),
  authController.signUp
);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

export default router;
