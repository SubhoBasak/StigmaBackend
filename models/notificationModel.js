import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    user: { type: String, required: [true, "Invalid User"] },
    pid: { type: String, required: [true, "Invalid Post"] },
    name: { type: String, required: [true, "Invalid User"] },
    status: { type: String, required: [true, "Invalid Status"] },
  },
  { timestamps: true }
);

export default mongoose.model("notificationModel", notificationSchema);
