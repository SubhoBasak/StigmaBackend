import albumModel from "../models/albumModel";

export const getAlbums = async (req, res) => {
  try {
    const albums = await albumModel.find({ user: req.user });
    return res.status(200).json(albums);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const createAlbum = async (req, res) => {
  try {
    const album = new albumModel({ user: req.user, name: req.body.name });
    await album.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const deleteAlbum = (req, res) => {
  try {
    await albumModel.findOneAndDelete({ user: req.user, _id: req.body.id });
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const editAlbum = (req, res) => {};

export const viewAlbum = (req, res) => {};
