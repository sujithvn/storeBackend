const Formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Product = require("../models/product");

exports.productById = (req, res, next, id) => {
  Product.findOne({_id: id}).exec((err, prod) => {
    if (err || !prod) {
      return res.status(400).json({
        error: "Product not found"
      });
    }
    // prod.photo =undefined;
    req.product = prod;
    next();
  });
};

exports.getReadProduct = (req, res, next) => {
  if (req.profile.id == req.product.userid){
    req.product.photo = undefined;
    return res.json(req.product);
  } else {
    return res.status(400).json({
      error: "No Product / User combination"
    });
  }
};

exports.deleteProduct = (req, res, next) => {
  // Product.findOneAndDelete({_id: req.product.id, userid: req.profile.id}, (err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: err
  //     });
  //   }
  //   res.json({message: `Product deleted successfully: ${result.product.name}`});
  // });
  res.status(400).json({error: `Please Deactivate instead of deleting product`});
};

exports.deactivateProduct = (req, res, next) => {
  Product.findOneAndUpdate({_id: req.product.id, userid: req.profile.id},
                           {active: false}, {new: true, useFindAndModify: false}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({message: `Product deactivated successfully: ${result.name}`});
  });
};

exports.postProductCreate = (req, res, next) => {
  const form = new Formidable();
  form.uploadDir = "./public/uploaded_images";
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Error in parsing the input fields"
      });
    }

    req.body = fields;

    req.check("name", "Product Name is required field").notEmpty();
    req.check("description", "Product description is required field").notEmpty();
    req.check("price", "Product price is required field").notEmpty();
    req.check("quantity", "Product quantity is required field").notEmpty();
    req.check("subcategory", "Sub-Category should be selected").notEmpty();
    req.check("name", `Product already registered`)
        .custom(value => {
          return Product.findOne({ name: value })
            .then(prodDB => {
              if (prodDB)  {
                return Promise.reject();
              }
            })
          });

    req.asyncValidationErrors()
    .then(msgs => {
      if (!msgs) {
        let product = new Product(fields);
        product.userid = req.profile.id;
        if (files.photo) {
          if (files.photo.size > 1000000) {
            return res.status(400).json({ error: "Image should be less than 1Mb" });
          }
          if ((files.photo.type != "image/jpeg") && 
              (files.photo.type != "image/jpg")  &&
              (files.photo.type != "image/png") ){
            return res.status(400).json({ error: "Image should be jpeg/jpg/png" });
          }

          product.photo.data = fs.readFileSync(files.photo.path);
          product.photo.contentType = files.photo.type;
          product.photopath = files.photo.path;
        }
   
        product.save((err, prod) => {
          if (err) {
            return res.status(400).json({ error: err });
          }
          prod.photo = undefined;
          res.json({ prod });
        });
      } else {
        console.error('In Product CTLR got err msgs ???');
        console.error(msgs);
      }
    })
    .catch(errors => {
      const firsterror = errors.map(error => error.msg)[0];
      return res.status(400).json({ error: firsterror });
    })
  });
};


exports.putProductUpdate = (req, res, next) => {
  const form = new Formidable();
  form.uploadDir = "./public/uploaded_images";
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Error in parsing the input fields"
      });
    }

    req.body = fields;

    req.check("name", "Product Name is required field").notEmpty();
    req.check("description", "Product description is required field").notEmpty();
    req.check("price", "Product price is required field").notEmpty();
    req.check("quantity", "Product quantity is required field").notEmpty();
    req.check("subcategory", "Sub-Category should be selected").notEmpty();
    // req.check("name", `Product already registered`)
    // not required for update validation as we're updating existing product by same name

    req.asyncValidationErrors()
    .then(msgs => {
      if (!msgs) {
        // let product = new Product(fields);
        let product = req.product;
        product = _.extend(product, fields);

        // product.userid = req.params.userId;  // ideally, userid should not be changed during update
        if (files.photo) {
          if (files.photo.size > 1000000) {
            return res.status(400).json({ error: "Image should be less than 1Mb" });
          }
          if ((files.photo.type != "image/jpeg") && 
              (files.photo.type != "image/jpg")  &&
              (files.photo.type != "image/png") ){
            return res.status(400).json({ error: "Image should be jpeg/jpg/png" });
          }

          product.photo.data = fs.readFileSync(files.photo.path);
          product.photo.contentType = files.photo.type;
          product.photopath = files.photo.path;
        }
   
        product.save((err, prod) => {
          if (err) {
            return res.status(400).json({ error: err });
          }
          prod.photo = undefined;
          res.json({ prod });
        });
      } else {
        console.error('In Product CTLR got err msgs ???');
        console.error(msgs);
      }
    })
    .catch(errors => {
      const firsterror = errors.map(error => error.msg)[0];
      return res.status(400).json({ error: firsterror });
    })
  });
};

exports.getListAllProducts = (req, res) => {
  const order = req.query.order ? req.query.order : 'desc';
  const sortBy = req.query.sortBy ? req.query.sortBy : 'updatedAt';
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 3;
  const query = {active: true};

  Product.find(query)
    .select("-photo")
    .populate({path: "subcategory", select: "name", populate: { path: "category", select: "name"}})
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, prodList) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.send(prodList);
    });
};


exports.getListAllRelProducts = (req, res) => {
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 3;
  const query = {_id: {$ne: req.product}, subcategory: req.product.subcategory, active: true};

  Product.find(query)
    .select("-photo")
    .limit(limit)
    .populate({path: "subcategory", select: "name", populate: { path: "category", select: "name"}})
    .exec((err, relProdList) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else if (relProdList.length == 0) {
        return res.status(400).json({ error: "No related products" });
      }
      res.send(relProdList);
    });    
};


exports.postSearchList = (req, res) => {
    const order = req.body.order ? req.body.order : "desc";
    const sortBy = req.body.sortBy ? req.body.sortBy : "updatedAt";
    const limit = parseInt(req.body.limit) ? parseInt(req.body.limit) : 10;
    const skip = parseInt(req.body.skip) ? parseInt(req.body.skip): 0;
    let findArgs = {};

    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
            if (key === "price") {
                  findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                  };
            } else {
              findArgs[key] = req.body.filters[key];
            }
          }
        }

    findArgs["active"] = true;
    
    Product.find(findArgs)
        .select("-photo")
        .populate({path: "subcategory", select: "name", populate: { path: "category", select: "name"}})
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, prods) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                size: prods.length,
                prods
            });
      });
};


exports.getPhoto = (req, res, next) => {

  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  next();

};