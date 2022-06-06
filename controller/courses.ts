import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../app";
import Course from "../model/course";

const getIndex = (_: Request, res: Response, next: NextFunction) => {
  Course.find()
    .then((courses) => {
      res.render("courses", {
        courses: courses,
        pageTitle: "Home",
        path: "/",
        mode: "",
      });
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

const getUnEnrolledCourses = (
  r: Request,
  res: Response,
  next: NextFunction
) => {
  const req = r as CustomRequest;
  Course.find({ _id: { $nin: req.user.coursesEnrolled } })
    .then((courses) => {
      res.render("courses", {
        courses: courses,
        pageTitle: "Courses",
        path: "/courses",
        mode: "courses",
      });
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

const getEnrolledCourses = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;
  Course.find({ _id: { $in: req.user.coursesEnrolled } })
    .then((coursesEnrolled) => {
      res.render("courses", {
        courses: coursesEnrolled,
        pageTitle: "Enroll",
        path: "/enrolled-courses",
        mode: "enroll",
      });
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

const enrollCourse = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;
  req.user
    .enrollCourse(req.body.id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err: any) => {
      err.status = 500;
      next(err);
    });
};

const unEnrollCourse = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;
  req.user
    .unEnrollCourse(req.body.id)
    .then(() => {
      res.redirect("/enrolled-courses");
    })
    .catch((err: any) => {
      err.status = 500;
      next(err);
    });
};

export default {
  getIndex,
  getUnEnrolledCourses,
  enrollCourse,
  getEnrolledCourses,
  unEnrollCourse,
};
