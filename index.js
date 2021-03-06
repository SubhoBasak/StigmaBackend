import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import upload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";

// import routes
import user from "./routers/user.js";
import connection from "./routers/connection.js";
import profile from "./routers/profile.js";
import post from "./routers/post.js";
import newsFeed from "./routers/newsFeed.js";
import notification from "./routers/notification.js";
import comment from "./routers/comment.js";
import message from "./routers/message.js";

// import namespaces
import messageNamespace from "./namespaces/messageNamespace.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

// middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(upload({ limits: 5 * 1024 * 1024 }));
app.use(express.static("static"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

// routes
app.use("/user", user);
app.use("/comment", comment);
app.use("/connection", connection);
app.use("/profile", profile);
app.use("/post", post);
app.use("/news_feed", newsFeed);
app.use("/notification", notification);
app.use("/message", message);

server.listen(PORT, () => console.log("Server is running on port " + PORT));

io.of("/message").on("connect", messageNamespace);
