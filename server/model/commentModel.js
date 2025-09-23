const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  blogId: {type: mongoose.Schema.Types.ObjectId, ref: "blog", required: true},
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
  content: {type: String, required: true},
  isApproved: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = mongoose.model("comment", commentSchema)