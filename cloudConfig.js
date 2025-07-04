const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLUOD_API_KEY,
    api_secret : process.env.CLUOD_API_SECRETE
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_Dev',
      allowedFormats : ["png", "jpg", "jpeg"],
    },
});

module.exports = {  cloudinary, storage }