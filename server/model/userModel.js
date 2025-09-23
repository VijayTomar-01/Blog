const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true, unique: true},
  password: {type: String, required: true, trim: true},
  role: {type: String, enum: ["admin", "user"], default: "user"},
  // profilePic: {type: String, required: false,},
  // profilePicImageId: {type: Boolean, default: false, },
}, {timestamps: true})

userSchema.statics.signup = async function (name, email, password, role = "user") {
  const exists = await this.findOne({email})
  if(!email || !name ||!password){
    throw Error("All fields are mandatory")
  }
  if(!validator.isEmail(email)) throw Error("Email is not valid");
  if(!validator.isStrongPassword(password)) throw Error("Password is not strong");

  if(exists) throw Error("Email already exists");
  // if(role !== "user") role = "user" // force the sign up to be user

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await this.create({name, email, password: hashPassword, role: "user"})
  return user;
} 

userSchema.statics.login = async function (email ,password){
  const user = await this.findOne({email})
  if(!email || !password) throw Error("All fields are mandatory");
  if(!user) throw Error("Email is not valid");
  
  const match = await bcrypt.compare(password, user.password);
  if(!match) throw Error("Incorrect Password")
  
  return user;
}

module.exports = mongoose.model("user", userSchema)