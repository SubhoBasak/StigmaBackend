import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";

export const commentNow = async (req, res) => {
  try {
    console.log(req.body);
    const user = await userModel.findById(req.user);
    req.post_details.comment.push({
      user: req.user,
      comment: req.body.comment,
    });

    await req.post_details.save();

    const notf = new notificationModel({
      pid: req.post_details._id,
      user: req.post_details.user,
      name: user.name,
      status: 2,
    });
    await notf.save();

    return res.status(200).json({
      cid: new Date().toString(),
      uid: req.user,
      name: user.name,
      profile: user.image,
      comment: req.body.comment,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};
