const express = require("express");
const router = express.Router();
const { User } = require("../../models/index");
const { UserError, ServerError } = require("../../helper/errorHandleHelper");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  res.render("signUp", { message: "" });
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
      throw new UserError(400, "USERS_INVALID_VALUE");
    }

    const user = await User.findOne({
      where: { email: userData.email },
      attributes: ["email"],
    });
    if (user) {
      throw new UserError(400, "USERS_ALREADY_EXISTS_USER");
    }

    const hash = await bcrypt.hash(userData.password, 10);
    if (!hash) {
      throw new ServerError(500, "SERVER_ERROR");
    }

    const newUser = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hash,
    });

    if (!newUser) {
      throw new ServerError(500, "SERVER_ERROR");
    }

    req.session.userId = newUser.id;
    req.session.userName = newUser.firstName;
    res.redirect("/auth/home");
  } catch (error) {
    res.render("signUp", { message: error.message });
  }
});

module.exports = router;
