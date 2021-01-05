const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");

const Register = require("./register");
const List = require("./list");
const Update = require("./update");
const Remove = require("./remove");

const router = express.Router();

router.post("/register", isLoggedIn, Register);
router.get("/list", List);
router.patch("/update/:id", isLoggedIn, Update);
router.delete("/remove/:id", isLoggedIn, Remove);

module.exports = router;
