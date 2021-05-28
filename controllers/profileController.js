import userModel from "../models/userModel.js";

/**
 * @api /profile
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 401, 404, 500
 */
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);

    if (!user) {
      return res.sendStatus(404);
    }

    return res.status(200).json({
      uid: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      cover: user.cover,
      address: user.address,
      bio: user.bio,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /profile
 * @method POST
 * @param {Content-Type, Authorization} req headers
 * @param {image, cover} req files
 * @param {name, bio, address} req body
 * @returns 200, 401, 500
 */
export const editProfile = async (req, res) => {
  try {
    var user = await userModel.findById(req.user);

    if (!user) {
      return res.sendStatus(404);
    }

    if (req.files) {
      if (req.files.image) {
        req.files.image.mv("static/profile/" + req.user + ".jpg");
        user.image = true;
      } else if (req.files.cover) {
        req.files.cover.mv("static/cover/" + req.user + ".jpg");
        user.cover = true;
      }
    } else {
      if (req.body.name) user.name = req.body.name;
      if (req.body.bio) user.bio = req.body.bio;
      if (req.body.address) user.address = req.body.address;
    }
    await user.save();

    return res.status(200).json({
      uid: user.id,
      name: user.name,
      image: user.image,
      cover: user.cover,
      address: user.address,
      bio: user.bio,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /profile/view
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @param {uid} req query
 * @returns 200, 401, 405, 500
 */
export const viewProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.query.uid);

    return res.status(200).json({
      uid: user._id,
      name: user.name,
      image: user.image,
      cover: user.cover,
      bio: user.bio,
      email: user.email,
      address: user.address,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};
