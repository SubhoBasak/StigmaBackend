import notificationModel from "../models/notificationModel.js";

/**
 * @api /notification
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 401, 500
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ user: req.user })
      .sort({ createdAt: "desc" });
    return res.status(200).send(notifications);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /notification
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {nid} req body
 * @returns 200, 401, 404, 500
 */
export const notificationReaded = async (req, res) => {
  try {
    var notf = await notificationModel.findById(req.body.nid);
    if (notf) {
      notf.delete();
      return res.sendStatus(200);
    } else return res.sendStatus(404);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /notification/all
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 401, 500
 */
export const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.find({ user: req.user }).deleteMany();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};
