import connectionModel from "../models/connectionModel.js";

const isConnected = async (req, res, next) => {
  try {
    const connection = await connectionModel.findOne({
      userA: req.userA,
      userB: req.userB,
      status: 1,
    });

    if (connection) {
      req.connection = connection;
      next();
    } else return res.sendStatus(405);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default isConnected;
