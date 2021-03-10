const express = require("express");
const cors = require("cors");

const corsOptions = {
  origin: "https://www.gatmauel.com",
};

const { isLoggedIn } = require("../../lib/loginMiddleware");
const getNoticeById = require("./mid/getNoticeById");

const write = require("./write");
const list = require("./list");
const remove = require("./remove");
const update = require("./update");
const read = require("./read");
const search = require("./search");
const push = require("./push");

const router = express.Router();

router.post("/write", isLoggedIn, write);
router.get("/list", list);
router.delete("/remove/:id", isLoggedIn, getNoticeById, remove);
router.patch("/update/:id", isLoggedIn, getNoticeById, update);
router.get("/read/:id", getNoticeById, read);
router.get("/search", cors(corsOptions), search);
router.post("/push", cors(corsOptions), push);

module.exports = router;
