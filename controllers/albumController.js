import albumModel from "../models/albumModel";

export const getAlbums = (req, res) => {};

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
    try{
        await albumModel.findOneAndDelete({user: req.user, _id: req.body.id})
        return res.sendStatus(200);
    } catch(error){
        return res.sendStatus(500);
    }
};

export const editAlbum = (req, res) => {
};
