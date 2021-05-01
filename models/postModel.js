import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: { type: String, required: [true, "Invalid user"] },
    caption: String,
    photos: [String],
    likes: [String],
    shares: [String],
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
