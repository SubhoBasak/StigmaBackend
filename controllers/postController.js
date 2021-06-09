import postModel from "../models/postModel.js";
import newsFeedModel from "../models/newsFeedModel.js";
import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

/**
 * @api /post
 * @method POST
 * @param {Content-Type, Authorization} req headers
 * @param {image} req files
 * @param {caption} req body
 * @returns 200, 401, 500
 */
export const createPost = async (req, res) => {
  try {
    const img_name =
      new Date().toISOString().replace(":", "-").replace(":", "-") +
      Math.floor(Math.random() * 10000);
    req.files.image.mv("static/post/" + img_name + ".jpg");

    var post = { user: req.user, photo: img_name };
    if (req.body.caption) post.caption = req.body.caption;

    post = new postModel(post);
    await post.save();

    // save to connected user's news feed
    var news_feed;
    for (var i = 0; i < req.connections.length; i++) {
      news_feed = await newsFeedModel.findOne({ user: req.connections[i] });
      if (!news_feed) {
        news_feed = new newsFeedModel({ user: req.connections[i] });
        news_feed.news_feed = [];
      }
      news_feed.news_feed.unshift({ pid: post._id });
      await news_feed.save();
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log("error is", error);
    return res.sendStatus(500);
  }
};

/**
 * @api /post
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 401, 500
 */
export const getPost = async (req, res) => {
  try {
    const posts = await postModel
      .find({ user: req.user })
      .select("_id user photo loves shares")
      .sort({ createdAt: "desc" });
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * @api /post/view
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @param {uid} req query
 * @returns 200, 401, 405, 500
 */
export const viewPost = async (req, res) => {
  try {
    const posts = await postModel
      .find(
        { user: req.query.uid },
        { _id: 1, user: 1, photo: 1, loves: 1, shares: 1, comment: 0 }
      )
      .sort({ createdAt: "desc" });
    return res.status(200).json(posts);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /post/share
 * @method POST
 * @param {Content-Type, Authorization} req headers
 * @param {pid} req body
 * @returns 200, 401, 404, 405, 500
 */
export const sharePost = async (req, res) => {
  try {
    const new_post = new postModel({
      user: req.user,
      photo: req.post_details.photo,
      caption: req.post_details.caption,
    });
    req.post_details.shares++;
    await new_post.save();
    await req.post_details.save();

    // create notification for owner of the source post
    var cur_user = await userModel.findById(req.user);

    var notification = new notificationModel({
      user: req.post_details.user,
      pid: req.post_details._id,
      name: cur_user.name,
      status: "1",
    });
    await notification.save();

    // save to connected user's news feed
    var news_feed;
    for (var i = 0; i < req.connections.length; i++) {
      news_feed = await newsFeedModel.findOne({ user: req.connections[i] });
      if (!news_feed) {
        news_feed = new newsFeedModel({ user: req.connections[i] });
        news_feed.news_feed = [];
      }
      news_feed.news_feed.unshift({ pid: new_post._id });
      await news_feed.save();
    }

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /post
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {pid} req body
 * @returns 200, 401, 500
 */
export const deletePost = async (req, res) => {
  try {
    const post = await postModel.findOne({ _id: req.body.pid, user: req.user });
    if (post) {
      await post.delete();
      return res.sendStatus(200);
    } else return res.sendStatus(404);
  } catch (error) {
    res.sendStatus(500);
  }
};

/**
 * @api /post/details
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @param {pid} req query/body
 * @returns 200, 401, 404, 500
 */
export const postDetails = async (req, res) => {
  try {
    const pid = req.body.pid || req.query.pid;
    const post = await postModel.findOne({ _id: pid, user: req.user });
    const user = await userModel.findById(req.user);

    if (post)
      return res.status(200).json({
        pid: post._id,
        caption: post.caption,
        photo: post.photo,
        love: post.loves,
        share: post.shares,
        comment: post.comment,
        name: user.name,
        profile: user.image,
        uid: user._id,
      });
    else return res.sendStatus(404);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /post/view_details
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @param {pid} req query/body
 * @returns 200, 401, 404, 500
 */
export const viewPostDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.post_details.user);
    if (!user) {
      await req.post_details.delete();
      return res.sendStatus(404);
    }

    // get user news feed
    var nfeed = await newsFeedModel.findOne({ user: req.user });
    if (!nfeed) {
      // if news feed not available then create and return method not allowed
      var nfeed = new newsFeedModel({ user: req.user });
      await nfeed.save();
      return res.sendStatus(405);
    }

    // check weather this post is in the news feed of this user or not
    nfeed = nfeed.news_feed.filter((pst) => pst.pid == req.post_details._id)[0];
    if (!nfeed) return res.sendStatus(405);

    console.log(req.post_details);
    console.log(nfeed);

    const result = {
      uid: user._id,
      profile: user.image,
      name: user.name,
      caption: req.post_details.caption,
      photo: req.post_details.photo,
      love: req.post_details.loves,
      share: req.post_details.shares,
      comment: req.post_details.comment,
      loved: nfeed.loved,
    };
    return res.status(200).json(result);
  } catch (error) {
    return res.sendStatus(500);
  }
};
