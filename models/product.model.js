const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let products  = new Schema({
  SKU: {type: String},
  Quantity: {type: String},
  ProductName: {type: String},
  Description: {type: String},
  images: {type: String },
  cloudinary_id: {type: String}
},
  {
  timestamps: true
  }
);

module.exports = mongoose.model("Products", products );