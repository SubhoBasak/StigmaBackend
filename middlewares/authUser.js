import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config("../.env");

const authUser = async (req, res, next) => {
  try {
    const user = jwt.verify(req.headers.authorization, process.env.AUTH_KEY);
    if (user) {
      req.user = user.payLoad.user;
      next();
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.sendStatus(401);
  }
};

export default authUser;
