const User = require("../models/user");

exports.userRegisterValidator = (req, res, next) => {
    req.check("fname", "First Name is required field").notEmpty();
    req.check("lname", "Last Name is required field").notEmpty();
    req.check("email")
        .isEmail()
        .withMessage("Invalid or empty eMail")
        .normalizeEmail();
    req.check("email", "eMail already registered")
        .custom(value => {
          return User.findOne({ email: value })
            .then(userDB => {
              if (userDB)  {
                return Promise.reject();
              }
            })
          });
    req.check("password", "Password is required field").notEmpty();
    req.check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars long")
      .matches(/\d/)
      .withMessage("Password must contain atleast one digit");
  
    // const errors = req.validationErrors();
    // if (errors) {
      const errors = req.asyncValidationErrors()
      .then(msgs => {
        if (!msgs) {
          return next();
        } else {
          console.log('Got validation errors... processing');
          console.log(msgs);
        }
      })
      .catch(errors => {
        const firsterror = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firsterror });
      })
    //next();
  };
  