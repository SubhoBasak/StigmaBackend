import connectionModel from "../models/connectionModel.js";
import userModel from "../models/userModel.js";

export const getProfile = async (req, res) => {
  try {
    var user, userA, userB;
    if (req.body.uid) {
      if (req.user < req.body.uid) {
        userA = req.user;
        userB = req.body.uid;
      } else {
        userB = req.user;
        userA = req.body.uid;
      }

      if (!connectionModel.findOne({ userA, userB, status: 1 })) {
        return res.sendStatus(405);
      }

      user = await userModel.findById(req.body.uid);
    } else {
      user = await userModel.findById(req.user);
    }

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
