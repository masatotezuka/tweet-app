const express = require("express");
const router = express.Router();

const home = require("./home");
const signUp = require("./signUp");
const login = require("./login");
const users = require("./users");

// router.use((req, res, next) => {
//   if (req.session.userId) {
//     res.redirect("/auth/home");
//     console.log("リダイレクト");
//     return;
//   }
//   console.log("next");
//   next();
// });

console.log("next1");
router.use("/", home);
router.use("/signUp", signUp);
router.use("/login", login);
router.use("/users", users);

module.exports = router;
