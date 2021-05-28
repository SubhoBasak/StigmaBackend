import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";
import fetchPost from "../middlewares/fetchPost.js";
import isConnected from "../middlewares/isConnected.js";
import sortUser from "../middlewares/sortUser.js";
import getConnection from "../middlewares/getConnections.js";

// controllers
import {
  createPost,
  deletePost,
  getPost,
  likePost,
  sharePost,
} from "../controllers/postController.js";

const router = express.Router();

router
  .route("/")
  .get(authUser, getPost)
  .post(authUser, getConnection, createPost)
  .delete(authUser, deletePost);
router.post("/like", authUser, fetchPost, sortUser, isConnected, likePost);
router.post("/share", authUser, fetchPost, sortUser, isConnected, sharePost);

export default router;
