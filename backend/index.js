import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import taskRoutes from "./routes/task.route.js"
import reportRoutes from "./routes/report.route.js"
import cors from "cors"
dotenv.config()

const app=express()
const PORT=process.env.PORT
app.use(express.json())
app.use(cors({
    origin:process.env.CLIENT_URL || "*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))


app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/tasks',taskRoutes)
app.use('/api/reports',reportRoutes)

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running in ${PORT} `)
})
