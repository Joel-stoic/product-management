import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1]

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Attach user info (without password) to request
            req.user = await User.findById(decoded.userId).select("-password")

            if (!req.user) {
                return res.status(404).json({ message: "User not found" })
            }

            next()
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
    } else {
        return res.status(401).json({ message: "Not authorized, token missing" })
    }
}

export const adminOnly=(req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        res.status(403).json({message:"Access denied,admin"})
    }
}


