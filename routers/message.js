import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";

// controllers
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/", authUser, getMessages);

export default router;
