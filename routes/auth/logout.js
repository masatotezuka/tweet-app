const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await req.session.destroy(() => {
    console.log("completed delete");
    res.redirect("/");
  });
});

module.exports = router;
