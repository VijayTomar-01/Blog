const userModel = require("../model/userModel.js");
const bcrypt = require("bcryptjs")

const seedAdmin = async () => {
    const adminEmail = "admin123@gmail.com"
    const exists = await userModel.findOne({email: adminEmail})
    if(!exists){
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash("Admin123!@#", salt);
      await userModel.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashPassword,
        role: "admin"
      })
      console.log(`Admin created with email ${adminEmail} and password Admin123!@#`);
    } else {
      console.log("Admin already exists");
    }
}

module.exports = seedAdmin;