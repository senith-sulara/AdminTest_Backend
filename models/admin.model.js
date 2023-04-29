const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Admin model for login
//data is inserted to the DB from Mongodb query, There is no backend function for register admin
let Admin = new Schema({
    email: {type: String},
    password: { type: String},
  },
   { 
    timestamps: true 
   }
  );
  
  module.exports = mongoose.model("Admin", Admin);