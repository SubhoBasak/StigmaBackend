import newsFeedModel from "../models/newsFeedModel.js";
import notificationModel from "../models/notificationModel.js";
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
      post = await postModel.findById(news_feed.news_feed[i].pid);
      if (post) {
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
          loved: news_feed.news_feed[i].loved,
        });
      } else {
        news_feed.news_feed = news_feed.news_feed.filter(
          (data) => data.pid !== news_feed.news_feed[i].pid
        );
        await news_feed.save();
      }
    }

    return res.status(200).json(all_news_feed);
  } catch (error) {
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
    news_feed.news_feed = news_feed.news_feed.filter(
      (data) => data.pid !== req.body.pid
    );
    await news_feed.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /news_feed
 * @method PUT
 * @param {Content-Type, Authorization} req headers
 * @param {pid} req body
 * @returns 200, 401, 404, 500
 */
export const lovePost = async (req, res) => {
  try {
    var news_feed = await newsFeedModel.findOne({ user: req.user });
    var news_feed_post = news_feed.news_feed.filter(
      (post) => post.pid === req.body.pid
    );

    if (news_feed_post) {
      news_feed_post = news_feed_post[0];
      var post = await postModel.findById(news_feed_post.pid);

      if (post) {
        // the actual post exists
        if (news_feed_post.loved) {
          // if already loved then remove the love
          post.loves--;
          news_feed_post.loved = false;
          await post.save();
          await news_feed.save();
          return res.sendStatus(200);
        } else {
          // otherwise loved it
          post.loves++;
          news_feed_post.loved = true;
          await post.save();
          await news_feed.save();

          // create notification for source post user
          var cur_user = await userModel.findById(req.user);
          var notification = new notificationModel({
            user: post.user,
            pid: post._id,
            name: cur_user.name,
            status: "0",
          });
          await notification.save();

          return res.sendStatus(200);
        }
      } else {
        // actual post doesn't exist, remove it from news feed.
        news_feed.news_feed = news_feed.news_feed.filter(
          (post) => post.pid !== req.body.pid
        );
        await news_feed.save();
        return res.sendStatus(404);
      }
    } else {
      // coundn't found the post on the news feed
      return res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};
