const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    user.hashedPassword = undefined;
    user.salt =undefined;
    req.profile = user;
    next();
  });
};


exports.getUser = (req, res) => {
  return res.json(req.profile);
};

exports.putUpdateUser = (req, res) => {
  
  User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (err, usr) => {
    if (err) {
      return res.status(400).json({error: err});
    }
    usr.hashedPassword = undefined;
    usr.salt = undefined;
    res.json(usr);
  });
};
