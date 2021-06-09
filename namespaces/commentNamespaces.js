import userModel from "../models/userModel.js";
import connectionModel from "../models/connectionModel.js";
import postModel from "../models/postModel.js";

const commentNamespace = (socket) => {
  socket.on("comment", () => {});
};

export default commentNamespace;
