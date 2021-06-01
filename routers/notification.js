import express from "express";

// middlewares
import authUser from "../middlewares/authUser.js";

// controllers
import {
  getNotifications,
  notificationReaded,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router
  .route("/")
  .get(authUser, getNotifications)
  .delete(authUser, notificationReaded);
router.route("/all").delete(authUser, markAllAsRead);

export default router;
