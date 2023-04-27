const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Admin = new Schema({
    fullname: {type: String},
    contactNo: {type: String},
    email: {type: String},
    password: { type: String},
  },
   { 
    timestamps: true 
   }
  );
  
  module.exports = mongoose.model("Admin", Admin);