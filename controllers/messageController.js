import messageModel from "../models/messageModel.js";

export const getMessages = async (req, res) => {
  try {
    const msg = await messageModel.find({
      $or: [
        { sender: req.user, receiver: req.query.uid },
        { sender: req.query.uid, receiver: req.user },
      ],
    });
    return res.status(200).json(msg);
  } catch (error) {
    return res.sendStatus(500);
  }
};
