const userModel = require("../model/userModel.js")
const jwt = require("jsonwebtoken")

const requireAuth = async (req,res,next) => {

  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({success: false, message: "Authentication token required"});
  }

  const token = authHeader.split(" ")[1];

  try {
    const {_id} = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(_id).select('-password')
    if(!user){
      return res.status(404).json({success: false, message: "User not found"})
    }
    req.user = user;
    next()

  } catch (error) {
    console.log(error);
    return res.status(401).json({success: false, message: "Unauthorized: Invalid Token"})
  }

}

module.exports = requireAuth;