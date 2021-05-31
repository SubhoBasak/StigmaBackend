import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";
import fetchPost from "../middlewares/fetchPost.js";
import isConnected from "../middlewares/isConnected.js";
import sortUser from "../middlewares/sortUser.js";
import getConnections from "../middlewares/getConnections.js";

// controllers
import {
  createPost,
  deletePost,
  getPost,
  sharePost,
  viewPost,
} from "../controllers/postController.js";

const router = express.Router();

router
  .route("/")
  .get(authUser, getPost)
  .post(authUser, getConnections, createPost)
  .delete(authUser, deletePost);
router.post(
  "/share",
  authUser,
  fetchPost,
  sortUser,
  isConnected,
  getConnections,
  sharePost
);
router.get("/view", authUser, sortUser, isConnected, viewPost);

export default router;
