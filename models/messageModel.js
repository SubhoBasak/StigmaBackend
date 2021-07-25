import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: String, required: [true, "Invalid Sender"] },
    receiver: { type: String, required: [true, "Invalid Receiver"] },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("messageModel", messageSchema);
