const express = require("express")
const { getDashboard } = require("../controllers/blogController");
const requireAuth = require("../middleware/requireAuth");
const dashboardRouter = express.Router()

dashboardRouter.get('/dashboard',requireAuth, getDashboard)

module.exports = dashboardRouter;