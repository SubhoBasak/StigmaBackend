import postModel from "../models/postModel.js";

const fetchPost = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.body.pid);
    if (post) {
      req.post_details = post;
      req.body.uid = post.user;
      next();
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default fetchPost;
