// multer middleware to upload image from local to imagekit
const multer = require("multer")

const upload = multer({storage: multer.diskStorage({})});

module.exports = upload;