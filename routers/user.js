import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").post(verifyEmail);
router.route("/forgot").post(forgotPassword);
router.route("/reset").post(resetPassword);

export default router;
