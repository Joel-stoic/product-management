import express from "express"
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { createTask, deleteTask, getDashboardData, getTask, getTaskById, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/task.controller.js";


const router=express.Router()

router.get("/dashboard-data",protect,getDashboardData)
router.get("/user-dashboard-data",protect,getUserDashboardData)
router.get("/",protect,getTask)
router.get("/:id",protect,getTaskById)
router.post("/",protect,adminOnly,createTask)
router.put("/:id",protect,updateTask)
router.delete("/:id",protect,adminOnly,deleteTask)
router.put("/:id/status",protect,updateTaskStatus)
router.put("/:id/todo",protect,updateTaskChecklist)


export default router;