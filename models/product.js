const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32
    },
    subcategory: {
      type: ObjectId,
      ref: "SubCategory",
      trim: true,
      required: true
    },
    quantity: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    photopath: {
        type: String,
        trim: true
      },
    shipping: {
      type: Boolean,
      required: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    userid: {
        type: ObjectId,
        ref: 'User',
        trim: true,
        required: true
      }  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
