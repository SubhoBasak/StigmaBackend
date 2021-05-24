import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
  user: { type: String, required: [true, "Invalid User"] },
  image: Boolean,
  cover: Boolean,
  bio: String,
  dob: Date,
  address: String,
});

export default mongoose.model("profileModel", profileSchema);
