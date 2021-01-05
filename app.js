const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
sequelize.sync();
passportConfig(passport);

app.set("port", process.env.PORT || 9091);

const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");
const noticeRouter = require("./routes/notice");
const foodRouter = require("./routes/food");
const categoryRouter = require("./routes/category");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    exposedHeaders: ["Last-Page"],
  })
);
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/comment", commentRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/food", foodRouter);
app.use("/api/category", categoryRouter);
app.use("/api", (req, res, next) => {
  res.send("api root directory");
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;

  next(err);
});

app.use((err, req, res) => {
  const error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send(error);
});

app.listen(app.get("port"));
