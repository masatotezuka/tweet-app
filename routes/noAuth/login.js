const express = require("express");
const { UserError } = require("../../helper/errorHandleHelper");
const router = express.Router();
const { User } = require("../../models/index");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  res.render("login", { message: "" });
});

router.post("/", async (req, res, next) => {
  try {
    const requestData = req.body;
    if (!requestData.email || !requestData.password) {
      throw new UserError(400, "USERS_INVALID_VALUE");
    }

    const user = await User.findOne({
      where: { email: requestData.email },
      attributes: ["id", "firstName", "email", "password"],
    });
    if (!user) {
      throw new UserError(400, "NOT_FOUND_USER");
    }
    const match = await bcrypt.compare(requestData.password, user.password);

    if (match === true) {
      req.session.userId = user.id;
      req.session.userName = user.firstName;
      if (!req.session.backUrl) {
        res.redirect("/auth/home");
      } else {
        //backURL削除
        res.redirect(req.session.backUrl);
      }
    } else {
      throw new UserError(400, "NOT_FOUND_USER");
    }
  } catch (error) {
    //エラーメッセージ対応
    res.render("login", { message: error.message });
  }
});

module.exports = router;

// .then((result) => {
// }).catch((err) => {
// });で書いた場合

// router.post("/", (req, res, next) => {
//   const userData = req.body;
//   if (!userData.email || !userData.password) {
//     return res.render("login", { message: ["USER_INVALID_VALUE"] });
//   }

//   User.findOne({
//     where: { email: userData.email },
//     attributes: ["id", "firstName", "email", "password"],
//   })
//     .then((result) => {
//       if (!result) {
//         throw new UserError(404, "NOT_FOUND_USER");
//       }
//       bcrypt
//         .compare(userData.password, result.password)
//         .then((match) => {
//           if (match === true) {
//             req.session.userId = result.id;
//             req.session.userName = result.firstName;
//             res.redirect("/auth/home");
//           } else {
//             throw new UserError(404, "NOT_FOUND_USER");
//           }
//         })
//         .catch((error) => {
//           return res.render("login", { message: error.message });
//         });
//     })
//     .catch((error) => {
//       return res.render("login", { message: error.message });
//     });
// });
