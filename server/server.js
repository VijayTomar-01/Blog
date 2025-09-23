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

const PORT = process.env.PORT
const FRONTEND_PORT = process.env.FRONTEND_PORT

// middlewares
app.use(express.json());
app.use(cors({
  origin: `http://localhost:${FRONTEND_PORT}`
}))
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
  console.log(`🚀 App is up and running on port: http://localhost:${4000}`);
})

