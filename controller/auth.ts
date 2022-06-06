import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../model/user";
import bcrypt from "bcrypt";
import { CustomRequest } from "../app";

const getInvalidUser = (req: Request, res: Response, errorMessage: string) => {
  return res.status(422).render("auth", {
    pageTitle: "Log In",
    path: "/login",
    mode: "login",
    user: {
      userName: req.body.userName,
      password: req.body.password,
    },
    errorMessage: errorMessage,
  });
};

const getSignUp = (_: Request, res: Response) => {
  res.render("auth", {
    pageTitle: "Sign Up",
    path: "/signUp",
    mode: "signUp",
    errorMessage: "",
  });
};

const getLogin = (_: Request, res: Response, __: NextFunction) => {
  res.render("auth", {
    pageTitle: "Login",
    path: "/login",
    mode: "login",
    errorMessage: "",
  });
};

const signUp = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth", {
      pageTitle: "Sign Up",
      path: "/signUp",
      mode: "signUp",
      user: {
        userName: req.body.userName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const user = new User({
        userName: req.body.userName,
        password: hashedPassword,
        coursesEnrolled: [],
        role: "USER",
        _id: null,
      });
      user.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err: any) => {
      err.status = 500;
      next(err);
    });
};

const login = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;

  User.findOne({ userName: req.body.userName })
    .then((user) => {
      if (!user) {
        return getInvalidUser(req, res, "Invalid user name or password");
      }
      bcrypt.compare(req.body.password, user.password).then((matched) => {
        if (!matched) {
          return getInvalidUser(req, res, "Invalid user name or password");
        }
        req.session.isLoggedIn = true;
        req.session.userName = req.body.userName;
        res.redirect("/");
      });
    })
    .catch((err) => {
      err.status = 500;
      next(err);
    });
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      err.status = 500;
      return next(err);
    }
    res.redirect("/");
  });
};

export default {
  getLogin,
  getSignUp,
  login,
  signUp,
  logout,
};
