import mongoose from "mongoose";

const newsFeedSchema = mongoose.Schema({
  user: { type: String, required: [true, "Invalid User"] },
  news_feed: [
    {
      pid: { type: String, required: [true, "Invalid Post"] },
      loved: Boolean,
    },
  ],
});

export default mongoose.model("newsFeedModel", newsFeedSchema);
