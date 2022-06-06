import { NextFunction, Request, Response } from "express";
import Course from "../model/course";
import { validationResult } from "express-validator";
import { CustomRequest } from "../app";
const getCourses = (_: Request, res: Response, next: NextFunction) => {
  Course.find()
    .then((courses) => {
      res.render("courses", {
        courses: courses,
        pageTitle: "Courses",
        path: "/admin",
        mode: "admin",
      });
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

const getAddCourse = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id) {
    return Course.findById(req.params.id)
      .then((course) => {
        res.render("add-course", {
          pageTitle: "Edit Courses",
          path: "/admin/edit-course",
          edit: true,
          course: course,
          errorMessage: "",
        });
      })
      .catch((err) => {
        err.status = 500;
        next(err);
      });
  }
  res.render("add-course", {
    pageTitle: "Add Courses",
    path: "/admin/add-course",
    edit: false,
    errorMessage: "",
  });
};

const addCourse = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add-course", {
      pageTitle: "Add Courses",
      path: "/admin/add-course",
      edit: false,
      course: {
        title: req.body.title,
        author: req.body.author,
        duration: req.body.duration,
        level: req.body.level,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  const course = new Course({
    title: req.body.title,
    author: req.body.author,
    duration: req.body.duration,
    level: req.body.level,
    _id: null,
  });
  course
    .save()
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err: any) => {
      err.status = 500;
      next(err);
    });
};

const editCourse = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add-course", {
      pageTitle: "Edit Courses",
      path: "/admin/edit-course",
      edit: true,
      course: {
        title: req.body.title,
        author: req.body.author,
        duration: req.body.duration,
        level: req.body.level,
        _id: req.body.id,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  Course.findById(req.body.id)
    .then((course) => {
      course.title = req.body.title;
      course.author = req.body.author;
      course.duration = req.body.duration;
      course.level = req.body.level;
      course.save();
    })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

const deleteCourse = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;

  Course.findByIdAndRemove(req.body.id)
    .then(() => {
      req.user.unEnrollCourse(req.body.id);
    })
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

export default {
  getCourses,
  getAddCourse,
  addCourse,
  editCourse,
  deleteCourse,
};
