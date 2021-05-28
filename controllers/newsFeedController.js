import newsFeedModel from "../models/newsFeedModel.js";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

/**
 * @api /news_feed
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 401, 500
 */
export const getNewsFeed = async (req, res) => {
  try {
    var news_feed = await newsFeedModel.findOne({ user: req.user });
    if (!news_feed) {
      news_feed = new newsFeedModel({ user: req.user });
      news_feed.news_feed = [];
      await news_feed.save();
    }

    var all_news_feed = [];
    var post;
    var author;
    for (var i = 0; i < news_feed.news_feed.length; i++) {
      post = await postModel.findById(news_feed.news_feed[i]);
      if (!post) continue;
      author = await userModel.findById(post.user);
      all_news_feed.push({
        pid: post._id,
        uid: author._id,
        photo: post.photo,
        image: author.image,
        name: author.name,
        caption: post.caption,
        loves: post.loves,
        shares: post.shares,
      });
    }

    return res.status(200).json(all_news_feed);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * @api /news_feed
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {pid} req body;
 * @returns 200, 401, 500
 */
export const deleteNewsFeed = async (req, res) => {
  try {
    var news_feed = await newsFeedModel.findOne({ user: req.user });
    news_feed.news_feed.filter((data) => data !== req.body.pid);
    await news_feed.save();
    return res.status(200).json(news_feed);
  } catch (error) {
    return res.sendStatus(500);
  }
};
