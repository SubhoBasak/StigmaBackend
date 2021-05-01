import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import upload from "express-fileupload";

// import routes
import user from "./routers/user.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(upload({ limits: 30 * 1024 * 1024 }));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

// routes
app.use("/user", user);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
