const sortUser = (req, res, next) => {
  try {
    var last, userA, userB;
    var other;
    if (req.query.uid) other = req.query.uid;
    else if (req.body.uid) other = req.body.uid;
    else return res.sendStatus(400);

    if (req.user < other) {
      userA = req.user;
      userB = other;
      last = true;
    } else {
      userA = other;
      userB = req.user;
      last = false;
    }

    req.userA = userA;
    req.userB = userB;
    req.last = last;

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default sortUser;
