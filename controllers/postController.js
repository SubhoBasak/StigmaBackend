import postModel from "../models/postModel.js";
import newsFeedModel from "../models/newsFeedModel.js";

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
    const img_name = new Date() + Math.floor(Math.random() * 10000);
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
      news_feed.news_feed.push(post._id);
      await news_feed.save();
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
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
    const posts = await postModel.find({ user: req.user });
    return res.status(200).json(posts);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const likePost = async (req, res) => {
  try {
    req.post_details.like++;
    await req.post_details.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const sharePost = (req, res) => {};

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
    await post.delete();
    return res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
