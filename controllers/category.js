const Category = require("../models/category");

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
