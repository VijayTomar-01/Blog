const blogModel = require("../model/blogModel.js");
const fs = require("fs")
const imagekit = require("../config/imagekit.js");
const commentModel = require("../model/commentModel.js")

exports.createBlog = async (req,res) => {
  try {
    const {title, subTitle, content, category} = req.body;
    const imageFile = req.file;

    if(!imageFile){
      return res.status(400).json({success: false, message: "Image is required"});
    }
    if(!req.user){
      res.status(401).json({success: false, message: "Authentication Required"})
    }

    let emptyFields = [];
    if(!title) {emptyFields.push("title")};
    if(!subTitle) {emptyFields.push("subTitle")};
    if(!content) {emptyFields.push("content")};
    if(!category) {emptyFields.push("category")};

    if(emptyFields.length > 0){
      return res.status(400).json({success: false, message: "Please fill out the fields", emptyFields});
    }

    const fileBuffer = await fs.promises.readFile(imageFile.path)

    const response = imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    })

    // clean the local file
    try {
      await fs.promises.unlink(imageFile.path)
    } catch (error) {
      console.warn("Couldn't delete image from the local file", error.message)
    }

    const optimizedImageUrl = imagekit.url({
      path: (await response).filePath,
      transformation: [
        {quality: 'auto'},
        {format: 'webp'},
        {width: '1280'},
      ]
    })

    const blog = await blogModel.create({
      title,
      subTitle,
      category,
      content,
      image: optimizedImageUrl,
      imageFileId: (await response).fileId,
      authorId: req.user._id,
      isPublished: req.user.role === "admin" ? true : false
    })

    res.status(201).json({success: true, message: "blog created successfully", blog})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

// admin can access all the blogs while the others can only see the published blogs
exports.getAllBlogs = async (req,res) => {
  try {
    let blogs;
    if(req.user && req.user?.role === "admin"){
      blogs = await blogModel.find().sort({createdAt: -1}).populate("authorId", "name");
    } else {
      blogs = await blogModel.find({isPublished: true}).sort({createdAt: -1}).populate("authorId", "name");
    }
    res.status(200).json({success: true, blogs})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

exports.getSingleBlogById = async (req,res) => {
  try {
    const {id} = req.params;
    let blog;
    if(req.user && req.user?.role === "admin"){
      blog = await blogModel.findById(id).populate("authorId", "name")
    } else {
      blog = await blogModel.findOne({_id: id, isPublished: true}).populate("authorId", "name")
    }

    if(!blog){
      return res.status(404).json({success: false, message: `Couldn't find the blog with id: ${id}`})
    }

    res.status(200).json({success: true, blog});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

exports.updateBlogById = async (req,res) => {
  try {
    const {id} = req.params;
    const user = req.user;
    const {title, subTitle, content, category} = req.body;
    const imageFile = req.file;
    if(!user){
      res.status(401).json({success: false, message: "Authentication Required"})
    }

    const blog = await blogModel.findById(id);

    if(!blog){
      return res.status(404).json({success: false, message: `Couldn't find the blog with id: ${id}`})
    }

    if(user.role !== "admin" && blog.authorId.toString() !== user._id.toString()){
      res.status(403).json({success: false, message: "Not authorized to perform this action"})
    }

    if(title) blog.title = title
    if(subTitle) blog.subTittle = subTitle
    if(content) blog.content = content
    if(category) blog.category = category

    // delete the stored old image file by id
    if(imageFile){
      if(blog.imageFileId){
        try {
          await imagekit.deleteFile(blog.imageFileId)
        } catch (error) {
          console.warn("Couldn't delete image from imagekit: ", error.message)
        }
      }
      const fileBuffer = await fs.promises.readFile(imageFile.path)

    const response = imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    })

    try {
      await fs.promises.unlink(imageFile.path)
    } catch (error) {
      console.warn("Couldn't delete local file: ", error.message)
    }

      blog.image = imagekit.url({
      path: (await response).filePath,
      transformation: [
        {quality: 'auto'},
        {format: 'webp'},
        {width: '1280'}
      ]
    });

      blog.imageFileId = (await response).fileId
    }

    await blog.save()
    res.status(200).json({success: true, message: "Blog updated successfully", blog})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})  
  }
}

exports.deleteBlogById = async (req,res) => {
  try {
    const {id} = req.params;
    const user = req.user; //from auth middleware
    if(!user){
      res.status(401).json({success: false, message: "Authentication Required"})
    }
    const blog = await blogModel.findById(id);

    if(!blog){
      return res.status(404).json({success: false, message: `Couldn't find the blog with id: ${id}`})
    }

    if(user.role === "admin" || (user.role === "user" && blog.authorId.toString() === user._id.toString())){
      if(blog.imageFileId){
       try {
        await imagekit.deleteFile(blog.imageFileId)
       } catch (error) {
        console.warn("Couldn't delete the image from imagekit", error.message)
       }
      }

      await blog.deleteOne();
      await commentModel.deleteMany({ blogId: id }); // THIS DELETES THE COMMENTS ASSOCIATED WITH THE BLOG ADDED LATER
      res.status(200).json({success: true, message: "Blog deleted successfully", blog})
    } else {
      res.status(403).json({success: false, message: 'Not authorized to delete this blog'})
    }
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

exports.togglePublish = async (req,res) => {
  try {
    const {id} = req.params;
    const user = req.user;
    if(!user){
      res.status(401).json({success: false, message: "Authentication Required"})
    }

    if(!user || user.role !== "admin"){
      return res.status(403).json({success: false, message: "Not authorized to perform this action"})
    }

    const blog = await blogModel.findById(id)

    if(!blog){
      return res.status(404).json({success: false, message: `Couldn't find blog by id: ${id}`})
    }

    blog.isPublished = !blog.isPublished

    await blog.save();
    res.status(200).json({success: true, message: `Blog ${blog.isPublished ? "Published" : "Unpublished"}`})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

exports.getDashboard = async (req,res) => {
  try {
    let dashboard = {
      stats: { totalBlogs: 0, totalDrafts: 0, totalComments: 0 },
      recentBlogs: [],
      drafts: [],
      comments: []
    };

    if(!req.user){
      return res.status(401).json({success: false, message: "Authentication Required"})
    }

    if(req.user?.role === "admin"){
      const recentBlogs = await blogModel.find().populate("authorId", "name").sort({createdAt: -1}).limit(8);
      const drafts = await blogModel.find({isPublished: false}).populate("authorId", "name").sort({createdAt: -1});
      const comments = await commentModel.find({isApproved: false}).sort({createdAt: -1}).populate("authorId", "name").limit(8);

      dashboard = {
        stats: {
          totalBlogs: await blogModel.countDocuments(),
          totalDrafts: await blogModel.countDocuments({isPublished: false}),
          totalComments: await commentModel.countDocuments()
        },
        recentBlogs,
        drafts,
        comments
      }
    } else {
      const user = req.user
      const recentBlogs = await blogModel.find({authorId: user._id}).sort({createdAt: -1}).limit(8)
      const drafts = await blogModel.find({authorId: user._id, isPublished: false}).sort({createdAt: -1})
      const comments = await commentModel.find({authorId: user._id}).sort({createdAt: -1}).limit(8);

      dashboard = {
        stats: {
          totalBlogs: await blogModel.countDocuments({ authorId: user._id }),
          totalDrafts: await blogModel.countDocuments({ authorId: user._id, isPublished: false }),
          totalComments: await commentModel.countDocuments({ authorId: user._id }),
        },
        recentBlogs,
        drafts,
        comments,
      }
    }
    res.status(200).json({success: true, dashboard})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}