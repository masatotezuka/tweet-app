const express = require("express");
const UserError = require("../helper/errorHandleHelper");
const router = express.Router();
const { User } = require("../models/index");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  res.render("login");
});

router.post("/", async (req, res, next) => {
  try {
    const userData = req.body;

    await User.findOne({
      where: { email: userData.email },
      attributes: ["id", "firstName", "email", "password"],
    }).then((result) => {
      if (!result.email) {
        throw new UserError(400, "NOT_FOUND_USER");
      }
      bcrypt.compare(userData.password, result.password).then((match) => {
        if (match === true) {
          req.session.userId = result.id;
          req.session.userName = result.firstName;
          console.log(req.session.userName);
          res.redirect("/auth/home");
        } else {
          throw new UserError(400, "NOT_FOUND_USER");
        }
      });
    });
  } catch (error) {
    //エラーメッセージ対応
    res.render("login");
  }
});

module.exports = router;
