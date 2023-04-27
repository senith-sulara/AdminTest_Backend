const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dz3ljnlvy",
  api_key: "489386556464742",
  api_secret: "jMwjOGQDk8lVSMHFkkNgA8SXAqU",
});

// exports.uplods = (file, folder) => {
//   return new Promise(resolve => {
//     cloudinary.uploader.upload(file, (result)=> {
//       resolve({
//         images:result.url,
//         cloudinary_id: result.public_id
//       })
//     })
//   })
// }

module.exports = cloudinary;
