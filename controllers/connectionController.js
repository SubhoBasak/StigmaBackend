import connectionModel from "../models/connectionModel.js";
import userModel from "../models/userModel.js";

/**
 * @api /connection/search
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @param {keyword} req params
 * @returns 200, 500
 */
export const search = async (req, res) => {
  try {
    var result = [];

    // check for new user
    var users = await userModel.find({
      verified: true,
      $or: [
        { email: { $regex: ".*" + req.query.keyword + ".*", $options: "i" } },
        { name: { $regex: ".*" + req.query.keyword + ".*", $options: "i" } },
      ],
    });

    var connection = null;
    var userA;
    var userB;
    var aORb;

    for (var i = 0; i < users.length; i++) {
      if (req.user < users[i]._id) {
        userA = req.user;
        userB = users[i]._id;
        aORb = true;
      } else if (req.user > users[i]._id) {
        userA = users[i]._id;
        userB = req.user;
        aORb = false;
      } else {
        continue;
      }

      // check if there is any connection between them
      connection = await connectionModel.findOne({ userA, userB });
      if (!connection) {
        // no connection means new people
        result.push({
          uid: users[i]._id,
          image: users[i].image,
          name: users[i].name,
          email: users[i].email,
          status: "0",
        });
      } else if (connection.status === "0" && connection.last === aORb) {
        // request status and last is current user
        // means requested for current user
        result.push({
          uid: users[i]._id,
          cid: connection._id,
          image: users[i].image,
          name: users[i].name,
          email: users[i].email,
          status: "1",
        });
      } else if (connection.status === "0" && connection.last !== aORb) {
        // request status and last is not current user
        // means requests for current user
        result.push({
          uid: users[i]._id,
          cid: connection._id,
          image: users[i].image,
          name: users[i].name,
          email: users[i].email,
          status: "2",
        });
      } else if (connection.status === "1") {
        // connected
        result.push({
          uid: users[i]._id,
          cid: connection._id,
          image: users[i].image,
          name: users[i].name,
          email: users[i].email,
          status: "3",
        });
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/search
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @param {email} req params
 * @returns 200, 404, 405, 500
 */
/*
export const search_user = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.query.email,
      verified: true,
    });

    if (!user) {
      return res.sendStatus(404);
    }

    if (req.user < user._id) {
      var userA = req.user;
      var userB = user._id;
    } else {
      var userA = user._id;
      var userB = req.user;
    }

    const connection = await connectionModel.findOne({
      userA,
      userB,
      status: "2",
    });

    if (connection) {
      return res.sendStatus(405);
    }

    return res
      .status(200)
      .json({ uid: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
*/

/**
 * @api /connection/send_request
 * @method POST
 * @param {Content-Type, Authorization} req headers
 * @param {user} req body
 * @returns 200, 500
 */
export const send_request = async (req, res) => {
  try {
    var last;
    if (req.user < req.body.user) {
      var userA = req.user;
      var userB = req.body.user;
      last = true;
    } else {
      var userA = req.body.user;
      var userB = req.user;
      last = false;
    }

    var connection = await connectionModel.findOne({ userA, userB });
    if (connection) {
      return res.sendStatus(405);
    }

    connection = new connectionModel({ userA, userB, last, status: "0" });
    await connection.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/requested
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 500
 */
export const get_requested = async (req, res) => {
  try {
    const requested = await connectionModel.find({
      status: "0",
      $or: [
        { userA: req.user, last: true },
        { userB: req.user, last: false },
      ],
    });

    var user;
    for (var i = 0; i < requested.length; i++) {
      if (requested[i].userA === req.user)
        user = await userModel.findById(requested[i].userB);
      else user = await userModel.findById(requested[i].userA);

      if (!user) {
        requested[i].delete();
        continue;
      }

      requested[i] = {
        uid: user._id,
        cid: requested[i]._id,
        image: user.image,
        name: user.name,
        email: user.email,
      };
    }

    return res.status(200).json(requested);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/requests
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 500
 */
export const get_requests = async (req, res) => {
  try {
    const requests = await connectionModel.find({
      status: "0",
      $or: [
        { userA: req.user, last: false },
        { userB: req.user, last: true },
      ],
    });

    var user;
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].userA === req.user)
        user = await userModel.findById(requests[i].userB);
      else user = await userModel.findById(requests[i].userA);

      if (!user) {
        requests[i].delete();
        continue;
      }

      requests[i] = {
        uid: user._id,
        cid: requests[i]._id,
        image: user.image,
        name: user.name,
        email: user.email,
      };
    }

    return res.status(200).json(requests);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/connected
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 500
 */
export const get_connected = async (req, res) => {
  try {
    var connected = await connectionModel.find({
      status: "1",
      $or: [{ userA: req.user }, { userB: req.user }],
    });

    var user;
    for (var i = 0; i < connected.length; i++) {
      if (connected[i].userA === req.user)
        user = await userModel.findById(connected[i].userB);
      else user = await userModel.findById(connected[i].userA);

      if (!user) {
        connected[i].delete();
        continue;
      }

      connected[i] = {
        uid: user._id,
        cid: connected[i]._id,
        image: user.image,
        name: user.name,
        email: user.email,
      };
    }

    return res.status(200).json(connected);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/blocked
 * @method GET
 * @param {Content-Type, Authorization} req headers
 * @returns 200, 500
 */
export const get_blocked = async (req, res) => {
  try {
    var blocked = await connectionModel.find({
      status: "2",
      $or: [
        { userA: req.user, last: true },
        { userB: req.user, last: false },
      ],
    });

    var user;
    for (var i = 0; i < blocked.length; i++) {
      if (blocked[i].userA === req.user)
        user = await userModel.findById(blocked[i].userB);
      else user = await userModel.findById(blocked[i].userA);

      if (!user) {
        blocked[i].delete();
        continue;
      }

      blocked[i] = {
        uid: user._id,
        cid: blocked[i]._id,
        image: user.image,
        name: user.name,
        email: user.email,
      };
    }

    return res.status(200).json(blocked);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/block
 * @method PUT
 * @param {Content-Type, Authorization} req headers
 * @param {user} req body
 * @returns 200, 405, 500
 */
export const block_user = async (req, res) => {
  try {
    var last;
    if (req.user < req.body.user) {
      var userA = req.user;
      var userB = req.body.user;
      last = true;
    } else {
      var userA = req.body.user;
      var userB = req.user;
      last = false;
    }

    var block = await connectionModel.findOne({ userA, userB });
    if (block) {
      return res.sendStatus(405);
    }
    var block = new connectionModel({ userA, userB, last, status: "2" });
    await block.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/unblock
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {cid} req body
 * @returns 200, 405, 500
 */
export const unblock_user = async (req, res) => {
  try {
    var connection = await connectionModel.findById(req.body.cid);

    if (connection.status === "2") {
      if (connection.userA === req.user && connection.last === true) {
        await connection.delete();
        return res.sendStatus(200);
      } else if (connection.userB === req.user && connection.last === false) {
        await connection.delete();
        return res.sendStatus(200);
      }
    }
    return res.sendStatus(405);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/accept
 * @method PUT
 * @param {Content-Type, Authorization} req headers
 * @param {cid} req body
 * @returns 200, 404, 500
 */
export const accept_request = async (req, res) => {
  try {
    var connection = await connectionModel.findOne({
      _id: req.body.cid,
      status: "0",
      $or: [
        { userA: req.user, last: false },
        { userB: req.user, last: true },
      ],
    });

    if (!connection) {
      return res.sendStatus(404);
    }

    connection.status = "1";
    await connection.save();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/reject
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {cid} req body
 * @returns 200, 404, 500
 */
export const reject_request = async (req, res) => {
  try {
    var connection = await connectionModel.findOne({
      _id: req.body.cid,
      $or: [
        { userA: req.user, last: false },
        { userB: req.user, last: true },
      ],
    });

    if (!connection) {
      return res.sendStatus(404);
    }

    await connection.delete();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/cancel
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {cid} req body
 * @returns 200, 404, 500
 */
export const cancel_request = async (req, res) => {
  try {
    var connection = await connectionModel.findOne({
      _id: req.body.cid,
      $or: [
        { userA: req.user, last: true },
        { userB: req.user, last: false },
      ],
    });

    if (!connection) {
      return res.sendStatus(404);
    }

    await connection.delete();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /connection/remove
 * @method DELETE
 * @param {Content-Type, Authorization} req headers
 * @param {cid} req body
 * @returns 200, 404, 500
 */
export const remove_connection = async (req, res) => {
  try {
    var connection = await connectionModel.findOne({
      _id: req.body.cid,
      status: 1,
      $or: [{ userA: req.user }, { userB: req.user }],
    });

    if (connection) {
      connection.delete();
      return res.sendStatus(200);
    }

    return res.sendStatus(404);
  } catch (error) {
    return res.sendStatus(500);
  }
};
