import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";
import fetchPost from "../middlewares/fetchPost.js";
import sortUser from "../middlewares/sortUser.js";
import isConnected from "../middlewares/isConnected.js";

// routes
import { commentNow } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", authUser, fetchPost, sortUser, isConnected, commentNow);

export default router;
