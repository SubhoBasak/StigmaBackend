import express from "express";
import {
  search,
  send_request,
  get_blocked,
  get_requested,
  get_requests,
  get_connected,
  block_user,
  accept_request,
  reject_request,
  cancel_request,
  remove_connection,
  unblock_user,
} from "../controllers/connectionController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.get("/search", authUser, search);
router.post("/send_request", authUser, send_request);
router.get("/blocked", authUser, get_blocked);
router.get("/requested", authUser, get_requested);
router.get("/requests", authUser, get_requests);
router.get("/connected", authUser, get_connected);
router.put("/block", authUser, block_user);
router.put("/accept", authUser, accept_request);
router.delete("/reject", authUser, reject_request);
router.delete("/cancel", authUser, cancel_request);
router.delete("/remove", authUser, remove_connection);
router.delete("/unblock", authUser, unblock_user);

export default router;
