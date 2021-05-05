import connectionModel from "../models/connectionModel.js";
import userModel from "../models/userModel.js";

export const search_user = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.sendStatus(404);
    }

    if (req.user < user._id) {
      var userA = req.user;
      var userB = user._id;
      last = true;
    } else {
      var userA = user._id;
      var userB = req.user;
    }

    const connection = await connectionModel.findOne({
      userA,
      userB,
      status: "2",
    });

    if (connection) {
      return res.sendStatus(405);
    }

    return res
      .status(200)
      .json({ uid: user._id, name: user.name, email: user.email });
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const send_request = async (req, res) => {
  try {
    var last;
    if (req.user < res.body.user) {
      var userA = req.user;
      var userB = res.body.user;
      last = true;
    } else {
      var userA = res.body.user;
      var userB = req.user;
      last = false;
    }

    const connection = new connectionModel({ userA, userB, last, status: "0" });
    await connection.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const get_requested = async (req, res) => {
  try {
    const requested = await connectionModel.find({
      status: "0",
      $or: [
        { userA: req.user, last: true },
        { userB: req.user, last: false },
      ],
    });
    return res.status(200).json(requested);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const get_requests = async (req, res) => {
  try {
    const requests = await connectionModel.find({
      status: "0",
      $or: [
        { userA: req.user, last: false },
        { userB: req.user, last: true },
      ],
    });
    return res.status(200).json(requests);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const get_connected = async (req, res) => {
  try {
    const connected = await connectionModel.find({
      status: "1",
      $or: [{ userA: req.user }, { userB: req.user }],
    });
    return res.status(200).json(connected);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const get_blocked = async (req, res) => {
  try {
    const blocked = await connectionModel.find({
      status: "2",
      $or: [
        { userA: req.user, last: true },
        { userB: req.user, last: false },
      ],
    });
    return res.status(200).json(blocked);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const block_user = async (req, res) => {
  try {
    var last;
    if (req.user < res.body.user) {
      var userA = req.user;
      var userB = res.body.user;
      last = true;
    } else {
      var userA = res.body.user;
      var userB = req.user;
      last = false;
    }

    var block = await connectionModel.findOne({ userA, userB });
    if (block) {
      block = new connectionModel({ userA, userB, last, status: "2" });
      await block.save();
      return res.sendStatus(200);
    } else if (block.status != "2") {
      block.status = "2";
      await block.save();
      return res.sendStatus(200);
    }

    return res.sendStatus(405);
  } catch (error) {
    return res.sendStatus(500);
  }
};
