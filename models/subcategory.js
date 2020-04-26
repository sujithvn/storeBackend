const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true
    },
    userid: {
      type: ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subcategorySchema);
