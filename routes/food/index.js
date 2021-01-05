const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const Register = require("./register");
const Remove = require("./remove");
const Update = require("./update");

const router = express.Router();

router.post("/register", isLoggedIn, Register);
router.delete("/remove/:id", isLoggedIn, Remove);
router.patch("/update/:id", isLoggedIn, Update);

module.exports = router;
