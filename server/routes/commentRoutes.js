const express = require("express")
const requireAuth = require("../middleware/requireAuth")
const { addComment, getAllComments, getBlogComments, updateComment, approveComment, deleteComment } = require("../controllers/commentController");
const requireAdmin = require("../middleware/requireAdmin");
const commentRouter = express.Router()

commentRouter.post('/add-comment', requireAuth, addComment);
commentRouter.get('/', requireAuth, getAllComments);
commentRouter.get('/:blogId', requireAuth, getBlogComments);
commentRouter.put('/:id', requireAuth, updateComment);
commentRouter.patch('/:id/approve', requireAuth, requireAdmin(), approveComment);
commentRouter.delete('/:id', requireAuth, deleteComment);

module.exports = commentRouter