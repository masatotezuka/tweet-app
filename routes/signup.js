const express = require("express");
const router = express.Router();
const { User } = require("../models/index");
const UserError = require("../helper/errorHandleHelper");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  res.render("signup");
});

router.post("/", async (req, res, next) => {
  try {
    const userData = req.body;

    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.password
    ) {
      throw new UserError(400, "INVALID_PARAMETER");
    }

    await User.findOne({
      where: { email: userData.email },
      attributes: ["email"],
    }).then((result) => {
      if (result) {
        throw new UserError(400, "USERS_ALREADY_EXISTS_USER");
      }
    });

    const hash = await bcrypt.hash(userData.password, 10);

    await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hash,
    }).then((user) => {
      req.session.userId = user.id;
      req.session.userName = user.firstName;
    });

    res.redirect("/auth/home");
  } catch (error) {
    console.log(error.message);
    res.render("signup");
  }
});

module.exports = router;
