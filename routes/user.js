// import express from "express";
const express = require("express");
const router = express.Router();

// import { SignUp } from "../controllers/User.js";
const { SignUp, Login, Logout } = require("../controllers/User");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");
// 1st way
// router.route("/signup").post(SignUp);

// industry way
router.post("/signup", SignUp);
router.post("/login", Login);
router.get("/logout", Logout);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);
module.exports = router;
