import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import connectionModel from "../models/connectionModel.js";
import postModel from "../models/postModel.js";
import notificationModel from "../models/notificationModel.js";

const commentNamespace = async (socket) => {
  try {
    var user = jwt.verify(
      socket.handshake.headers.authorization,
      process.env.AUTH_KEY
    );
    user = await userModel.findById(user.payLoad.user);
    if (!user) socket.emit("err", { status: 401 });
    user.commentId = socket.id;
    await user.save();

    socket.on("disconnect", async () => {
      var user = jwt.verify(
        socket.handshake.headers.authorization,
        process.env.AUTH_KEY
      );
      user = await userModel.findById(user.payLoad.user);
      if (!user) socket.emit("err", { status: 401 });
      user.commentId = null;
      await user.save();
    });

    socket.on("comment", async (data) => {
      var user = jwt.verify(
        socket.handshake.headers.authorization,
        process.env.AUTH_KEY
      );
      user = await userModel.findById(user.payLoad.user);
      if (!user) socket.emit("err", { status: 401 });

      var post = await postModel.findById(data.pid);
      if (!post) socket.emit("err", { status: 404 });

      var userA, userB;
      if (user._id < post.user) {
        userA = user._id;
        userB = post.user;
      } else {
        userA = post.user;
        userB = user._id;
      }

      if (await connectionModel.findOne({ userA, userB, status: "1" })) {
        post.comment.push({
          user: user._id,
          comment: data.comment,
        });
        const notf = new notificationModel({
          user: post.user,
          pid: post._id,
          name: user.name,
          status: "2",
        });

        await post.save();
        await notf.save();

        socket.emit("submit", {
          cid: new Date().toString(),
          uid: user._id,
          name: user.name,
          profile: user.image,
          comment: data.comment,
        });
      } else {
        socket.emit("err", { status: 405 });
      }
    });
  } catch (error) {
    socket.emit("err", { status: 500 });
  }
};

export default commentNamespace;
