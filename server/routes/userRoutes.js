const express = require("express")
const { signupUser, loginUser, getProfile, updateUser, deleteUser, getAllUsers } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const userRouter = express.Router();

userRouter.post('/signup', signupUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', requireAuth ,getProfile);
userRouter.get('/', requireAuth, requireAdmin(), getAllUsers)
userRouter.patch('/update/:id', requireAuth, updateUser)
userRouter.delete('/delete/:id', requireAuth, deleteUser)


module.exports = userRouter;