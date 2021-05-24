import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);

    if (req.query.uid) {
      var profile = await profileModel.findOne({ user: req.query.uid });
    } else {
      var profile = await profileModel.findOne({ user: req.user });
    }

    if (!profile) {
      if (req.query.uid) {
        user = await userModel.findById(req.query.uid);
        if (user) {
          profile = new profileModel({ user: user._id });
          await profile.save();
        } else {
          return res.sendStatus(404);
        }
      } else {
        profile = new profileModel({ user: req.user });
        await profile.save();
      }
    }

    return res.status(200).json({
      uid: user.id,
      email: user.email,
      name: user.name,
      image: profile.image,
      cover: profile.cover,
      address: profile.address,
      bio: profile.bio,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const editProfile = async (req, res) => {
  try {
    if (req.files) {
      if (req.files.image) {
        req.files.image.mv("static/profile/" + req.user + ".jpg");
      }
      if (req.files.cover) {
        req.files.cover.mv("static/cover/" + req.user + ".jpg");
      }
    }

    var profile = await profileModel.findOne({ user: req.user });
    var user = await userModel.findById(req.user);

    user.name = req.body.name;
    profile.image = true;
    profile.cover = true;
    profile.bio = req.body.bio;
    profile.address = req.body.address;

    await profile.save();
    await user.save();

    return res.status(200).json({
      uid: user.id,
      name: user.name,
      image: profile.image,
      cover: profile.cover,
      address: profile.address,
      bio: profile.bio,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};
