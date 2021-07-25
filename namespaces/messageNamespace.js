import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import connectionModel from "../models/connectionModel.js";
import messageModel from "../models/messageModel.js";

const messageNamespace = async (socket) => {
  try {
    var user = jwt.verify(
      socket.handshake.headers.authorization,
      process.env.AUTH_KEY
    );
    user = await userModel.findById(user.payLoad.user);
    user.chatId = socket.id;
    await user.save();

    socket.on("new_msg", async (data) => {
      const receiver = await userModel.findById(data.receiver);
      if (!receiver) return;

      const new_msg = new messageModel({
        sender: user._id,
        receiver: data.receiver,
        message: data.message,
      });
      await new_msg.save();

      if (receiver.chatId) {
        socket
          .to(receiver.chatId)
          .emit("rcv_msg", {
            sender: user._id,
            message: data.message,
            createdAt: new_msg.createdAt,
          });
      }
    });

    socket.on("disconnect", async () => {
      user.chatId = null;
      await user.save();
    });
  } catch (error) {
    console.log(error);
  }
};

export default messageNamespace;
