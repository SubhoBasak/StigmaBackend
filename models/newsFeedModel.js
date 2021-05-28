import mongoose from "mongoose";

const newsFeedSchema = mongoose.Schema({
  user: { type: String, required: [true, "Invalid User"] },
  news_feed: [String],
});

export default mongoose.model("newsFeedModel", newsFeedSchema);
