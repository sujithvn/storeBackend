const User = require("../models/user");

exports.postRegister = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({ err });
        }
        user.salt = undefined;
        user.hashedPassword = undefined;
        res.json({ user });
    });
};
  