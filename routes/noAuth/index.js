const express = require("express");
const router = express.Router();

const home = require("./home");
const signUp = require("./signUp");
const login = require("./login");
const users = require("./users");

router.use("/", home);
router.use("/signUp", signUp);
router.use("/login", login);
router.use("/users", users);

module.exports = router;
