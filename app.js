const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
require("dotenv").config();

const { sequelize } = require("./models");
const passportConfig = require("./passport");
const logger = require("./logger");

const app = express();
app.set("port", process.env.PORT || 9091);

sequelize.sync();
passportConfig(passport);

const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comment");
const noticeRouter = require("./routes/notice");
const foodRouter = require("./routes/food");
const categoryRouter = require("./routes/category");

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Last-Page"],
  })
);
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: false,
  },
};
if (process.env.NODE_ENV === "production") {
  const redis = require("redis");
  const RedisStore = require("connect-redis")(session);

  sessionOption.proxy = true;
  sessionOption.cookie.secure = true;

  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    logErrors: true,
  });
  sessionOption.store = new RedisStore({ client: redisClient });
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production") {
  app.use("/@admin/auth", authRouter);
  app.use("/@admin/comment", commentRouter);
  app.use("/@admin/notice", noticeRouter);
  app.use("/@admin/food", foodRouter);
  app.use("/@admin/category", categoryRouter);
  app.use("/@admin", (req, res, next) => {
    res.send("api root directory");
  });
} else {
  app.use("/api/auth", authRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/notice", noticeRouter);
  app.use("/api/food", foodRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api", (req, res, next) => {
    res.send("api root directory");
  });
}

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;

  next(err);
});

app.use((err, req, res) => {
  if (process.env.NODE_ENV === "production") {
    logger.error(err.message);
  }

  const error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.send(error);
});

app.listen(app.get("port"));
