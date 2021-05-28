import connectionModel from "../models/connectionModel.js";

const getConnections = async (req, res, next) => {
  try {
    const connected = await connectionModel.find({
      status: 1,
      $or: [{ userA: req.user }, { userB: req.user }],
    });

    var connection_list = [];

    for (var i = 0; i < connected.length; i++) {
      if (connected[i].userA === req.user)
        connection_list.push(connected[i].userB);
      else connection_list.push(connected[i].userA);
    }

    req.connections = connection_list;

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default getConnections;
