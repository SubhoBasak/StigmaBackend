import mongoose from "mongoose";

const albumSchema = mongoose.Schema({
  user: { type: String, required: [true, "Invalid user"] },
  album_name: { type: String, required: [true, "Enter the album name"] },
  photos: [String],
});

export default mongoose.model("albumModel", albumSchema);
