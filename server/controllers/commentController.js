const commentModel = require("../model/commentModel.js");
const blogModel = require("../model/blogModel.js")

exports.addComment = async (req,res) => {
  try {
    const {blogId, content} = req.body;
    if(!blogId || !content){
      return res.status(400).json({success: false, message: "BlogId and Content are required"})
    }

    const blog = await blogModel.findOne({_id: blogId, isPublished: true})
    if(!blog){
      return res.status(404).json({success: false, message: "Blog not found or not published"})
    }

    const comment = await commentModel.create({blogId, authorId: req.user?._id, content, isApproved: false});
    res.status(201).json({success: true, message: "Comment added. Await admin approval", comment})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.getBlogComments = async (req,res) => {
  try {
    const {blogId} = req.params;
    let filter = {blogId, isApproved: true}
    if(req.user?.role === "admin"){
      filter = {blogId} //admin can see all the comments
    }

    const comments = await commentModel.find(filter).sort({createdAt: -1}).populate("authorId", "name email role")
    res.status(200).json({success: true, comments})
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.approveComment = async (req,res) => {
  try {
    const {id} = req.params;
    if(!req.user){
      return res.status(401).json({success: false, message: "Authentication required"})
    }
    const comment = await commentModel.findById(id)
    if(!comment){
      return res.status(404).json({success: false, message: `Comment not found by id: ${id}`})
    }
    comment.isApproved = true
    await comment.save();
    res.status(200).json({ success: true, comment, message: "Comment approved" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.updateComment = async (req,res) => {
  try {
    const {id} = req.params;
    const {content} = req.body;
    if(!req.user){
      return res.status(401).json({success: false, message: "Authentication required"})
    }
    if(!content){
    return res.status(400).json({ success: false, message: "Content is required" });
    }
    const comment = await commentModel.findById(id)
    if(!comment){
    return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if(req.user?.role !== "admin" && comment.authorId?.toString() !== req.user?._id?.toString()){
      return res.status(403).json({ success: false, message: "Not authorized to update this comment" });
    }

    comment.content = content;
    comment.isApproved = false
    await comment.save();

    res.status(200).json({success: true, message: "Comment updated. Waiting for admin approval!", comment})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const {id} = req.params;
    const comment = await commentModel.findById(id);
    if(!req.user){
      return res.status(401).json({success: false, message: "Authentication required"})
    }
    if (!comment){
       return res.status(404).json({ success: false, message: "Comment not found" })
    }

    if (req.user?.role !== "admin" && comment.authorId?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment" })
    }

    await comment.deleteOne()
    res.status(200).json({ success: true, message: "Comment deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.getAllComments = async (req, res) => {
  try {
    let filter = {};
    if (req.user?.role !== "admin") {
      filter.authorId = req.user?._id;
    }
    const comments = await commentModel
      .find(filter)
      .populate("authorId", "name email role")
      .populate("blogId", "title")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, comments })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}