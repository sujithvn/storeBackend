const _ = require("lodash");

const Category = require("../models/category");

exports.categoryById = (req, res, next, id) => {
  Category.findOne({_id: id}).exec((err, catg) => {
    if (err || !catg) {
      return res.status(400).json({
        error: "Category not found"
      });
    }
    req.category = catg;
    next();
  });
};

exports.postCategoryCreate = (req, res) => {
  const category = new Category(req.body);
  category.userid = req.profile._id;
  category.save((err, catg) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ catg });
  });
};


exports.getReadCategory = (req, res, next) => {
  if (req.profile.id == req.category.userid){
    return res.json(req.category);
  } else {
    return res.status(400).json({
      error: "No Category / User combination"
    });
  }
};

exports.putCategoryUpdate = (req, res) => {
  let category = req.category;
  category = _.extend(category, req.body);
  // category.userid = req.profile._id; // ideally, userid should not be changed during update
  category.save((err, catg) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ catg });
  });
};



exports.deleteCategory = (req, res, next) => {
  // Category.findOneAndDelete({_id: req.category.id, userid: req.profile.id}, (err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     });
  //   }
  //   res.json({message: `Category deleted successfully: ${result.name}`});
  // });
  res.status(400).json({error: `Category delete NOT implemented`});
};