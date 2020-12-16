const express = require("express");

const { isLoggedIn } = require("../../lib/loginMiddleware");
const getCommentById = require("./mid/getCommentById");

const write = require("./write");
const remove = require("./remove");
const update = require("./update");

const router = express.Router();

router.post("/write/:id", isLoggedIn, write);
router.delete("/remove/:id", isLoggedIn, getCommentById, remove);
router.patch("/update/:id", isLoggedIn, getCommentById, update);

module.exports = router;
