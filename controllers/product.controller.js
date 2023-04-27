// const path = require("path");
// const express = require("express");
// const multer = require("multer");
// const Product = require("../models/product.model");

// const Router = express.Router();
// const fs = require("fs");

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, path.join(__dirname, "../../frontend/public/images"));
//     },
//     filename(req, file, cb) {
//       cb(null, `${new Date().getTime()}_${file.originalname}`);
//     },
//   }),
//   limits: {
//     fileSize: 10000000, // max file size 10MB = 10000000 bytes
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
//       return cb(new Error("only upload files with jpg, jpeg, png format."));
//     }
//     cb(undefined, true); // continue with upload
//   },
// });

// Router.post(
//   "/upload",
//   upload.array("file[]"),
//   async (req, res) => {
//     try {
//       const { SKU, Quantity, ProductName, Description } = req.body;
//       let path = "";
//       req.files.forEach(function (files, index, arr) {
//         path = path + files.path + ",";
//       });
//       path = path.substring(0, path.lastIndexOf(","));

//       const product = new Product({
//         SKU,
//         Quantity,
//         ProductName,
//         Description,
//         image_path: path,
//       });
//       await product.save();
//       res.send("product uploaded successfully.");
//     } catch (error) {
//       res.status(400).send("Error while uploading product. Try again later.");
//     }
//   },
//   (error, req, res, next) => {
//     if (error) {
//       res.status(500).send(error.message);
//     }
//   }
// );

// Router.patch("/update/:id", (req, res) => {
//   Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then((blog) => {
//       if (!blog) {
//         return res.status(404).send();
//       }
//       res.send(blog);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// Router.get("/getAllProducts", async (req, res) => {
//   try {
//     const files = await Product.find({});
//     const sortedByCreationDate = files.sort(
//       (a, b) => b.createdAt - a.createdAt
//     );
//     res.send(sortedByCreationDate);
//   } catch (error) {
//     res
//       .status(400)
//       .send("Error while getting list of products. Try again later.");
//   }
// });


// Router.delete("/:id", async (req, res) => {
//   try {
//     // Find product by id
//     const product = await Product.findById(req.params.id);
//     if (!product) throw Error("No file found");
//     // Delete image from localStorage
//     fs.unlink(product.image_path, (err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//     });
//     //Delete product from db
//     const removed = await product.deleteOne();
//     if (!product)
//       throw Error("Something went wrong while trying to delete the product");
//     res.json(product);
//   } catch (e) {
//     res.status(400).json({ msg: e.message, success: false });
//   }
// });

// module.exports = Router;


const path = require("path");
const express = require("express");
const multer = require("multer");
const Product = require("../models/product.model");

const Router = express.Router();
const cloudinary = require("../utils/cloudinary.js");
const upload = require("../utils/multer.js");

//Insert

Router.post(
  "/insert",
  upload.single("image"),
  async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      let product = new Product({
        SKU: req.body.SKU,
        Quantity: req.body.Quantity,
        ProductName: req.body.ProductName,
        Description: req.body.Description,
        images: result.secure_url,
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
    res.status(400).send("Error while getting list of Product. Try again later.");
  }
});

Router.get("/getAllBooks/:ProductName", async (req, res) => {
  try {
    var regex = new RegExp(req.params.ProductName, "i"),
      query = { description: regex };
    const products = await Product.find(query, function (err, product) {
      if (err) {
        res.json(err);
      }

      res.json(product);
    });
    const sortedByCreationDate = products.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send("Error while getting list of Product. Try again later.");
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
      Quantity: req.body.Quantity || product.Quantity,
      ProductName: req.body.ProductName || product.ProductName,
      Description: req.body.Description || product.Description,
      images: result?.secure_url || product.images,
      cloudinary_id: result?.public_id || product.cloudinary_id,
    };
    product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
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