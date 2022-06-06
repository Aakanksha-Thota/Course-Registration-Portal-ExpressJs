import express, { Request } from "express";
import adminRoutes from "./routes/admin";
import courseRoutes from "./routes/courses";
import authRoutes from "./routes/auth";
import session, { Session } from "express-session";
import bodyParser from "body-parser";
import User from "./model/user";
import { connect } from "mongoose";
interface CustomSession extends Session {
  userName: string;
  isLoggedIn: boolean;
}

export interface CustomRequest extends Request {
  session: CustomSession;
  user: any;
}
const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use(
  session({
    secret: "sessionSecret123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((r, _, next) => {
  const req = r as CustomRequest;
  if (!req.session.userName) {
    return next();
  }
  User.findOne({ userName: req.session.userName }).then((user) => {
    if (!user) {
      next(new Error("Invalid user"));
    }
    req.user = user;
    next();
  });
});
app.use((r, res, next) => {
  const req = r as CustomRequest;
  if (req.session.isLoggedIn) {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.role = req.user.role;
  } else {
    res.locals.isLoggedIn = false;
    res.locals.role = "USER";
  }
  next();
});
app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(courseRoutes);

app.use((err: any, _: any, res: any, __: any) => {
  res.render("errorPage", {
    pageTitle: "Error",
    path: "/error",
    message: err.message,
    status: err.status,
  });
});

app.use((_, res, __) => {
  res.render("404", { pageTitle: "Not Found", path: "/404" });
});

connect(
  "mongodb+srv://Aakanksha:Thota@cluster0.erc30.mongodb.net/course_management?retryWrites=true&w=majority"
).then(() => {
  console.log("Connected to DB");
  app.listen(3000);
});
