const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.post("/signup", authController.postSignup);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/user", (req, res) => {
  if (req.session.voter) {
    res.status(200).json({ voter: req.session.voter });
  } else {
    req.session.destroy(() => {});
    res.status(401).json("Not authenticated");
  }
});

module.exports = authRouter;
