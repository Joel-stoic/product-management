import express from "express"
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { exportTaskReport, exportUsersReport } from "../controllers/report.controller.js";
const router=express.Router()


router.get('/export/tasks',protect,adminOnly,exportTaskReport)
router.get('/export/userd',protect,adminOnly,exportUsersReport)


export default router;