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
    prod.photo =undefined;
    req.product = prod;
    next();
  });
};

exports.getReadProduct = (req, res, next) => {
  if (req.profile.id == req.product.userid){
    return res.json(req.product);
  } else {
    return res.status(400).json({
      error: "No Product / User combination"
    });
  }
};

exports.deleteProduct = (req, res, next) => {
  Product.findOneAndDelete({_id: req.product.id, userid: req.profile.id}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({message: `Product deleted successfully: ${result.product.name}`});
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
        product.userid = req.params.userId;
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

        product.userid = req.params.userId;
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