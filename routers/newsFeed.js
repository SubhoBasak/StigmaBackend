import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";

// controllers
import {
  getNewsFeed,
  deleteNewsFeed,
  lovePost,
} from "../controllers/newsFeedController.js";

const router = express.Router();

router
  .route("/")
  .get(authUser, getNewsFeed)
  .delete(authUser, deleteNewsFeed)
  .put(authUser, lovePost);

export default router;
