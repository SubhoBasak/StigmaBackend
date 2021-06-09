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
  postDetails,
  sharePost,
  viewPost,
  viewPostDetails,
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
router.get("/details", authUser, postDetails);
router.get(
  "/view_details",
  authUser,
  fetchPost,
  sortUser,
  isConnected,
  viewPostDetails
);

export default router;
