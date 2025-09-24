const express = require("express")
const upload = require("../middleware/multer.js")
const { getAllBlogs, createBlog, getSingleBlogById, updateBlogById, deleteBlogById, togglePublish } = require("../controllers/blogController")
const requireAuth = require("../middleware/requireAuth.js")
const requireAdmin = require("../middleware/requireAdmin.js")

const blogRouter = express.Router()

blogRouter.get('/', getAllBlogs)
blogRouter.post('/create', requireAuth, upload.single("image"), createBlog)
blogRouter.get('/:id', getSingleBlogById); // user can't see if not logged in
blogRouter.patch('/update/:id', requireAuth, upload.single("image"), updateBlogById);
blogRouter.delete('/delete/:id', requireAuth, deleteBlogById);
blogRouter.patch('/:id/toggle-publish', requireAuth, requireAdmin(), togglePublish)

module.exports = blogRouter;