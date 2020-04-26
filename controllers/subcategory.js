const SubCategory = require("../models/subcategory");

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
