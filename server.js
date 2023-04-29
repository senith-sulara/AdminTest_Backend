const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productController = require("./controllers/product.controller.js");
const adminController = require("./controllers/admin.controller.js");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8070;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//routes
app.use("/products", productController);
app.use("/admin", adminController);

app.use(express.static("image"));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
