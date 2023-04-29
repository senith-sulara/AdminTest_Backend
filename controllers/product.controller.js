const path = require("path");
const express = require("express");
const multer = require("multer");
const Product = require("../models/product.model");

const Router = express.Router();
const cloudinary = require("../utils/cloudinary.js");
const upload = require("../utils/multer.js");

//Insert products

Router.post(
  "/insert",
  upload.single("image"),
  async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      let product = new Product({
        SKU: req.body.SKU,
        Images: result.secure_url,
        ProductName: req.body.ProductName,
        Price: req.body.Price,
        Description: req.body.Description,
        Quantity: req.body.Quantity,
        cloudinary_id: result.public_id,
      });
      await product.save();
      res.send("Product details uploaded successfully.");
    } catch (error) {
      res
        .status(400)
        .send("Error while uploading Product details. Try again later.");
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

//////////////////////////////////////////
// get product details

Router.get("/getAllProducts", async (req, res) => {
  try {
    const products = await Product.find({});
    const sortedByCreationDate = products.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res
      .status(400)
      .send("Error while getting list of Product. Try again later.");
  }
});

//get product by product name
Router.get("/searchProduct/:ProductName", async (req, res) => {
  try {
    let key = req.params.ProductName;
    let query = { name: new RegExp(key, "i") };
    console.log(query);
    Staff.find(query, (err, result) => {
      if (err) {
        return next(err);
      }

      data = {
        status: "success",
        code: 200,
        data: result,
      };
      res.json(data);
    });
  } catch (error) {
    res
      .status(400)
      .send("Error while getting staff member Details. Try again later.");
  }
});

// Router.get("/getSearch/:ProductName", async (req, res) => {
//   try {
//     var regex = new RegExp(req.params.ProductName, "i"),
//       query = { description: regex };
//     const products = await Product.find(query, function (err, product) {
//       if (err) {
//         res.json(err);
//       }

//       res.json(product);
//     });
//     const sortedByCreationDate = products.sort(
//       (a, b) => b.createdAt - a.createdAt
//     );
//     res.send(sortedByCreationDate);
//   } catch (error) {
//     res.status(400).send("Error while getting list of Product. Try again later.");
//   }
// });

//get product by id
Router.get("/getProduct/:id", async (req, res) => {
  try {
    const prodcut = await Product.findById(req.params.id);
    console.log(prodcut);
    res.status(200).json(prodcut);
  } catch (error) {
    res.status(400).json(error);
  }
});

////////////////////////////////////

//Update
Router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(product.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      SKU: req.body.SKU || product.SKU,
      Images: result?.secure_url || product.Images,
      Price: req.body.Price || product.Price,
      ProductName: req.body.ProductName || product.ProductName,
      Description: req.body.Description || product.Description,
      Quantity: req.body.Quantity || product.Quantity,
      cloudinary_id: result?.public_id || product.cloudinary_id,
    };
    product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(product);
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

//////////////////////////////////////

//Delete
Router.delete("/:id", async (req, res) => {
  try {
    // Find product by id
    const product = await Product.findById(req.params.id);
    if (!product) throw Error("No product found");
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(product.cloudinary_id);
    // Delete product from db
    const removed = await product.deleteOne();
    if (!removed)
      throw Error("Something went wrong while trying to delete the product");
    res.json(product);
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = Router;
