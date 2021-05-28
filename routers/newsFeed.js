import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";

// controllers
import {
  getNewsFeed,
  deleteNewsFeed,
} from "../controllers/newsFeedController.js";

const router = express.Router();

router.route("/").get(authUser, getNewsFeed).delete(authUser, deleteNewsFeed);

export default router;
