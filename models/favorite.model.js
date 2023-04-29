const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Favorite model
const CartSchema = new Schema({
  items: [
    {
      productId: {
        type: String,
        ref: "Products",
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less then 1."],
        deafult: 1,
      },
      price: Number,
    },
  ],
});

module.exports = Cart = mongoose.model("cart", CartSchema);
