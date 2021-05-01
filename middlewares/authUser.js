import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authUser = async (req, res, next) => {
  const user = jwt.verify(req.headers.token, process.env.AUTH_TOKEN);
  if (user) {
    req.user = user.payLoad.user;
    next();
  } else {
    return res.sendStaus(401);
  }
};

export default authUser;
