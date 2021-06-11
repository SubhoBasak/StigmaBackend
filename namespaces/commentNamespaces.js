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
      if (!(post.user == user._id)) {
        if (user._id < post.user) {
          userA = user._id;
          userB = post.user;
        } else {
          userA = post.user;
          userB = user._id;
        }
      }

      if (
        post.user == user._id ||
        (await connectionModel.findOne({ userA, userB, status: "1" }))
      ) {
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

        var cid = new Date().toString();
        socket.emit("new", {
          cid,
          uid: user._id,
          name: user.name,
          profile: user.image,
          comment: data.comment,
        });

        var unique_users = [];
        for (var i = 0; i < post.comment.length; i++) {
          if (post.comment[i].user == user._id) continue;
          var flag = true;
          for (var j = 0; j < unique_users.length; j++) {
            if (post.comment[i].user == unique_users[j]) {
              flag = false;
              break;
            }
          }
          if (flag) {
            unique_users.push(post.comment[i].user);
          }
        }

        console.log(unique_users);

        for (var u = 0; u < unique_users.length; u++) {
          u = await userModel.findById(unique_users[u]);
          if (u && u.commentId) {
            socket.to(u.commentId).emit("new", {
              cid,
              uid: user._id,
              name: user.name,
              profile: user.image,
              comment: data.comment,
            });
          }
        }
      } else {
        socket.emit("err", { status: 405 });
      }
    });
  } catch (error) {
    socket.emit("err", { status: 500 });
  }
};

export default commentNamespace;
