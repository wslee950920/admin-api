const express = require("express");

const { isLoggedIn, isNotLoggedIn } = require("../../lib/loginMiddleware");

const Register = require("./register");
const Login = require("./login");
const Logout = require("./logout");

const router = express.Router();

router.post("/register", isNotLoggedIn, Register);
router.post("/login", isNotLoggedIn, Login);
router.get("/logout", isLoggedIn, Logout);

module.exports = router;
