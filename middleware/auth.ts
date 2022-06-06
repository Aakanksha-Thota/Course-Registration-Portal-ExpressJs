import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../app";
export const isLoggedIn = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
};
export const isAdmin = (r: Request, res: Response, next: NextFunction) => {
  const req = r as CustomRequest;
  if (req.user?.role !== "ADMIN") {
    return res.redirect("/");
  }
  next();
};
