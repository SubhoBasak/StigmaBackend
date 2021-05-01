import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  user: String,
  image: String,
  title: String,
  body: String,
  link: String,
  date: Date,
});

export default mongoose.model("notificationModel", notificationSchema);
