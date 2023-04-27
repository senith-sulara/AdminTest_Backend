const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productController = require('./controllers/product.controller.js');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8070;
const MONGODB_URI = process.env.MONGODB_URI;

// mongoose.connect(
//   MONGODB_URI,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (error) => {
//     if (error) {
//       console.log("DataBase ERROR: ", error.message);
//     }
//   }
// );

// mongoose.connection.once("open", () => {
//   console.log("Database Synced");
// });



// const mongoURI = "mongodb://localhost:27017/";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


app.use('/products', productController);
app.use(express.static("image"));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
