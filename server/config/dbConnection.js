const mongoose = require('mongoose');

function DbConnection(){

  const DB_URI = process.env.MONGO_URI

  mongoose.connect(DB_URI);
  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "Connection Error... 📡"))
  db.once("open", ()=>{
    console.log("DB Connected ... ✅");
  })
}

module.exports = DbConnection