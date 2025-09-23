const userModel = require("../model/userModel.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const createToken = (_id)=>{
  return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: "3d"})
}

exports.signupUser = async (req,res) => {
  try {
    const {name, email, password} = req.body;

    const user = await userModel.signup(name, email, password);
    const token = createToken(user._id);

    res.status(201).json({success: true, user: {id: user.id, name: user.name, email: user.email, password: user.password, role: user.role}, token})

  } catch (error) {
    res.status(400).json({success: false, message: error.message})
  }
}

exports.loginUser = async (req,res) => {
  try {
    const {email, password} = req.body;

    const user = await userModel.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({success: true, user: {id: user._id, name: user.name, email: user.email, password: user.password, role: user.role}, token})
  } catch (error) {
    res.status(400).json({success: false, message: error.message})
  }
}

exports.getProfile = async (req,res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password')
    if(!user){
      return res.status(404).json({success: false, message: "User not found"})
    }
    res.status(200).json({success: true, user})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

exports.updateUser = async (req,res) => {
  try {
    const {id} = req.params;
    const {name, email, password} = req.body

    if(!req.user){
      res.status(401).json({success: false, message: "Authentication Required"})
    }

    if(req.user?.role !== "admin" && req.user?.id !== id){
      return res.status(403).json({ success: false, message: "Not authorized to update"}) 
    }
    const user = await userModel.findById(id)
    if(!user){
      return res.status(404).json({success: false, message: "User not found"})
    }

    if(name) user.name = name
    if(email) user.email = email
    if(password){
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save()
    res.status(200).json({success: true, message: "Profile Updated", user: {id: user._id, name: user.name, email: user.email, role: user.role}})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

exports.deleteUser = async (req,res) => {
  try {
    const  {id} = req.params

    if(!req.user){
      res.status(401).json({success: false, message: "Authentication Required"})
    }

    if(req.user?.role !== "admin" && req.user?.id !== id ){
      return res.status(403).json({ success: false, message: "Not authorized to perform this action" });
    }

    const deletedUser = await userModel.findByIdAndDelete(id);
    if(!deletedUser){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

exports.getAllUsers = async (req,res) => {
  try {
    if(req.user?.role !== "admin"){
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const users = await userModel.find().select("-password")
    res.status(200).json({success: true, users})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}