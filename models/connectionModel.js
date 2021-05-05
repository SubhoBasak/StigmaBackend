import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({
  userA: { type: String, required: [true, "Invalid User"] },
  userB: { type: String, required: [true, "Invalid User"] },
  status: { type: String, default: 0 },
  last: { type: Boolean, required: [true, "Invalid User"] },
});

export default mongoose.model("connectionModel", connectionSchema);
