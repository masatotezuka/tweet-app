const express = require("express");
const router = express.Router();

const home = require("./home");
const users = require("./users");
const logout = require("./logout");

router.use("/", (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    req.session.backUrl = req.originalUrl;
    res.redirect("/login");
  }
});

router.use("/home", home);
router.use("/users", users);
router.use("/logout", logout);

module.exports = router;
