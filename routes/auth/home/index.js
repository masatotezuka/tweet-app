const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.session.userId) {
    res.render("auth/home");
    console.log(req.session.userId);
  } else {
    res.redirect("/");
  }
});

module.exports = router;
