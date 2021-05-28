import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: { type: String, required: [true, "Invalid user"] },
    caption: String,
    photo: String,
    loves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comment: [
      {
        user: { type: String, required: [true, "Invalid user"] },
        comment: { type: String, required: [true, "Enter the comment"] },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("postModel", postSchema);
