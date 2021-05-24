import express from "express";
import authUser from "../middlewares/authUser.js";
import { getProfile, editProfile } from "../controllers/profileController.js";

const router = express.Router();

router.route("/").get(authUser, getProfile).put(authUser, editProfile);

export default router;
