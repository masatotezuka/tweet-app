const express = require("express");
const createUuid = require("../helper/createUuid");
const { UserError } = require("../helper/errorHandleHelper");
const router = express.Router();
const { User } = require("../models/index");
const sendMail = require("../helper/sendMail");
const bcrypt = require("bcrypt");

router.get("/resetPassword", async (req, res) => {
  res.render("users/resetPassword", { message: "" });
});

router.post("/resetPassword", async (req, res) => {
  try {
    const url = "http://localhost:8000";
    const user = await User.findOne({
      where: { email: req.body.email },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "verificationToken",
        "verificationTokenExpiredAt",
      ],
    });
    if (!user) {
      throw new UserError(400, "NOT_FOUND_USER");
    }
    const token = createUuid();
    res.locals.passwordToken = token;
    const date = new Date();
    date.setHours(date.getHours() + 12);
    user.verificationToken = token;
    user.verificationTokenExpiredAt = date;
    await user.save();
    const verificationUrl = `${url}/users/verificationPassword?token=${token}`;

    const mailInformation = {
      to: user.email,
      subject: `パスワードを設定してください`,
      text: `パスワードのリセットを承りました。
  下記ＵＲＬより、パスワードを再設定してください。
  ${verificationUrl}`,
    };

    await sendMail(mailInformation);

    res.render("users/showMailConfirmation", { user: user.dataValues });
  } catch (error) {
    res.render("users/resetPassword.ejs", { message: error.message });
    console.log(error.message);
  }
});

router.get("/verificationPassword", async (req, res) => {
  try {
    const nowDate = new Date();

    const user = await User.findOne({
      where: { verificationToken: req.query.token },
      attributes: [
        "id",
        "email",
        "password",
        "verificationToken",
        "verificationTokenExpiredAt",
      ],
    });

    if (!user) {
      throw new UserError(400, "NOT_FOUND_USER");
    }

    if (nowDate > user.verificationTokenExpiredAt) {
      throw new UserError(401, "EXPIRED_ACCESS_TOKEN");
    }

    res.render("users/verificationPassword", {
      verificationToken: user.verificationToken,
      message: "",
    });
  } catch (error) {
    if (error.message === "NOT_FOUND_USER") {
      return res.redirect("error/error404");
    }
    if (error.message === "EXPIRED_ACCESS_TOKEN") {
      res.redirect("error/error401", { message: "" });
    }
  }
});

router.post("/verificationPassword", async (req, res) => {
  try {
    if (
      !req.body.password ||
      !req.body.password_confirm ||
      req.body.password_confirm !== req.body.password
    ) {
      throw new UserError(400, "USERS_INVALID_VALUE");
    }
    console.log(req.body.verificationToken);
    const user = await User.findOne({
      where: { verificationToken: req.body.verificationToken },
    });

    console.log(user);

    if (!user) {
      throw new UserError(400, "NOT_FOUND_USER");
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    if (!hash) {
      throw new UserError(500, "SERVER_ERROR");
    }

    await User.update(
      {
        password: hash,
        verificationToken: null,
        verificationTokenExpiredAt: null,
      },
      { where: { id: user.id } }
    );

    req.session.userId = user.id;
    req.session.userName = user.firstName;
    res.redirect("/auth/home");
  } catch (error) {
    if (error.message === "NOT_FOUND_USER") {
      res.render("error/error401", { message: error.message });
    } else {
      res.render("users/verificationPassword", {
        verificationToken: req.body.verificationToken,
        message: error.message,
      });
    }
  }
});

router.get("/showMailConfirmation", (req, res) => {
  res.render("users/showMailConfirmation");
});

module.exports = router;
