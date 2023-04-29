const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Product model
let products = new Schema(
  {
    SKU: { type: String },
    Images: { type: String },
    ProductName: { type: String },
    Price: { type: String },
    Description: { type: String },
    Quantity: { type: String },
    cloudinary_id: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", products);
