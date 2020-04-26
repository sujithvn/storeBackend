const User = require("../models/user");
const Category = require("../models/category");
const SubCategory = require("../models/subcategory");

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
  
  exports.userLoginValidator = (req, res, next) => {
    req.check("email")
        .isEmail()
        .withMessage("Invalid or empty eMail")
        .normalizeEmail();
    req.check("password", "Password is required field").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      const firsterror = errors.map(error => error.msg)[0];
      return res.status(400).json({ error: firsterror });
    }
    next();
  };

exports.categoryCreateValidator = (req, res, next) => {
  req.check("name", "Category Name is required field").notEmpty();
  req.check("name", `Category already registered`)
      .custom(value => {
        return Category.findOne({ name: value })
          .then(catgDB => {
            if (catgDB)  {
              return Promise.reject();
            }
          })
        });

  req.asyncValidationErrors()
    .then(msgs => {
      if (!msgs) {
        return next();
      } else {
        console.log('Got category validation errors... processing');
        console.log(msgs);
      }
    })
    .catch(errors => {
      const firsterror = errors.map(error => error.msg)[0];
      return res.status(400).json({ error: firsterror });
    })
};
  
exports.subCategoryCreateValidator = (req, res, next) => {
  req.check("name", "Sub-Category Name is required field").notEmpty();
  req.check("category", "Category should be selected").notEmpty();
  req.check("name", `Sub-Category already registered`)
      .custom(value => {
        return SubCategory.findOne({ name: value })
          .then(subcatgDB => {
            if (subcatgDB)  {
              return Promise.reject();
            }
          })
        });

  req.asyncValidationErrors()
    .then(msgs => {
      if (!msgs) {
        return next();
      } else {
        console.log('Got sub-category validation errors... processing');
        console.log(msgs);
      }
    })
    .catch(errors => {
      const firsterror = errors.map(error => error.msg)[0];
      return res.status(400).json({ error: firsterror });
    })
};

// productCreateValidator implemented in controllers/product 
// since we're handling multi-part form
