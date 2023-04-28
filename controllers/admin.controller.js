const path = require("path");
const express = require("express");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const Router = express.Router();
const config = require('../utils/config.js')
/**
 * sign in controller
 * @param req
 * @param res
 * @returns {Promise<any>}
 */

Router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user by email
    const getUser = await Admin.findOne({ email });
    if (!getUser) return res.status(404).json({ message: "Account not found" });
    if (password != getUser.password)
      return res.status(404).json({ message: "Invalid password" });

    if (getUser) {
      const token = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        config.key,
        {
          expiresIn: "1h",
        }
      );

      return res.json({
        code: 200,
        message: "Login successful",
        user: getUser,
        token: token,
      });
    }
  } catch (e) {
    res.status(500).json({ message: "Server error" + e });
  }
});


Router.get("/getAdmin/:id", async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const member = await Admin.find({ _id: id });
    res.send(member);
  } catch (error) {
    res
      .status(400)
      .send("Error while getting list of staff members. Try again later.");
  }
});
module.exports = Router;