const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for autorization check
const dotenv = require("dotenv");

dotenv.config();
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
  
exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    // find the user in the database based on email
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with the provided eMail does not exist, please signup"
            });
        }
        
        // if user found, authenticate with email & password
        // authenticate method is from the user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "EMail & Password do not match"
            });
        }
    
        // generate a signed token with user-id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        // persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        
        // return response with user and token to front-end client
        const { _id, fname, lname, email, role } = user;
        return res.json({ token, user: { _id, email, fname, lname, role } });
    });
};

exports.getLogout = (req, res) => {
    res.clearCookie("t");
    res.json({message: "Signout success"});
};

exports.isLoggedin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "authed"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.authed && req.profile._id == req.authed._id;
    if (!user) {
      return res.status(403).json({
        error: "Access Denied"
      });
    }
    next();
};
  
exports.isSeller = (req, res, next) => {
    if (req.profile.role < 1) {
        return res.status(403).json({
        error: "Seller resource, access denied!"
        });
    }
    next();
};
  
exports.isAdmin = (req, res, next) => {
    if (req.profile.role < 2) {
        return res.status(403).json({
        error: "Admin resource, access denied!"
        });
    }
    next();
};
