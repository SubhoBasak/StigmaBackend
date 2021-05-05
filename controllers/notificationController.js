import notificationModel from "../models/notificationModel";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({ user: req.user });
    return res.status(200).send(notifications);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const notificationReaded = async (req, res) => {
  try {
    var notf = await notificationModel.findOne({
      user: req.user,
      _id: req.body.id,
    });
    if (!notf) {
      return res.sendStatus(404);
    }
    notf.read = true;
    await notf.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const markAllAsRead = async (req, res) => {
  try{
    var notf_s = await notificationModel.find({user: req.user, read=false})
    notf_s.forEach((data) => data.read = true)
    await notf_s.save()
    return res.sendStatus(200);
  } catch(error){
    return res.sendStatus(500)
  }
}