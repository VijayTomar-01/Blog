const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {type: String, required: true,},
  subTitle: {type: String},
  content: {type: String, required: true},
  category: {type: String, required: true},
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
  image: {type: String, required: true},
  imageFileId: {type: String, required: true},
  isPublished: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = mongoose.model("blog", blogSchema)