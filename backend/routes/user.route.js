import express from "express"
import { adminOnly, protect } from "../middleware/auth.middleware.js"
import { deleteUser, getUserById, getUsers } from "../controllers/user.controller.js"


const router=express.Router()

router.get("/",protect,adminOnly,getUsers)
router.get("/:id",protect,getUserById)
// router.delete("/:id",protect,adminOnly,deleteUser)



export default router