const _ = require("lodash");

const SubCategory = require("../models/subcategory");

exports.subcategoryById = (req, res, next, id) => {
  SubCategory.findOne({_id: id}).exec((err, subcatg) => {
    if (err || !subcatg) {
      return res.status(400).json({
        error: "SubCategory not found"
      });
    }
    req.subcategory = subcatg;
    next();
  });
};

exports.postSubCategoryCreate = (req, res) => {
  const subcategory = new SubCategory(req.body);
  subcategory.userid = req.params.userId;
  subcategory.save((err, subcatg) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ subcatg });
  });
};


exports.getReadSubCategory = (req, res, next) => {
  if (req.profile.id == req.subcategory.userid){
    return res.json(req.subcategory);
  } else {
    return res.status(400).json({
      error: "No SubCategory / User combination"
    });
  }
};


exports.putSubCategoryUpdate = (req, res) => {
  let subcategory = req.subcategory;
  subcategory = _.extend(subcategory, req.body);
  // subcategory.userid = req.profile._id; // ideally, userid should not be changed during update
  subcategory.save((err, subcatg) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ subcatg });
  });
};


exports.deleteSubCategory = (req, res, next) => {
  // SubCategory.findOneAndDelete({_id: req.subcategory.id, userid: req.profile.id}, (err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     });
  //   }
  //   res.json({message: `SubCategory deleted successfully: ${result.name}`});
  // });
  res.status(400).json({error: `SubCategory delete NOT implemented`});
};