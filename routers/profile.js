import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";
import isConnected from "../middlewares/isConnected.js";
import sortUser from "../middlewares/sortUser.js";

// controllers
import {
  getProfile,
  editProfile,
  viewProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.route("/").get(authUser, getProfile).put(authUser, editProfile);
router.route("/view").get(authUser, sortUser, isConnected, viewProfile);

export default router;
