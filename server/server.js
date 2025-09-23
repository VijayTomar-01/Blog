const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors");


const DbConnection = require("./config/dbConnection");
const userRouter = require("./routes/userRoutes");
const seedAdmin = require("./config/seedAdmin");
const blogRouter = require("./routes/blogRoutes");
const commentRouter = require("./routes/commentRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");

dotenv.config();
const app = express();
DbConnection();
seedAdmin()

const PORT = process.env.PORT || 4000


// middlewares
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS not allowed for ${origin}`), false);
    }
    return callback(null, true);
  }
}));
app.use((req,res,next)=>{
  console.log(req.method, req.path);
  next();
})

app.get('/', (req,res)=>{
  res.status(200).json({success: true, message: `Home Page`});
})

app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);
app.use('/api/comment', commentRouter)
app.use('/api', dashboardRouter)

app.listen(PORT, ()=>{
  console.log(`🚀 App is up and running on port: ${PORT}`);
})

