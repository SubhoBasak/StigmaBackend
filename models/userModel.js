import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, "Enter the name"] },
  email: { type: String, required: [true, "Enter the email"] },
  password: { type: String, required: [true, "Enter the password"] },
  verified: { type: Boolean, default: false },
  otp: Number,
  expire: Date,
  bio: String,
  image: String,
  cover: String,
});

export default mongoose.model("userModel", userSchema);
