const express = require("express");
const router = express.Router();

router.get("/resetPassword", (req, res) => {
  res.render("users/resetPassword");
});

router.get("/verificationPassword", (req, res) => {
  res.render("users/verificationPassword");
});

router.get("/showMailConfirmation", (req, res) => {
  res.render("users/showMailConfirmation");
});

module.exports = router;
