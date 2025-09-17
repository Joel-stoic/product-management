import { Task } from "../models/task.model.js"
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"


export const getUsers = async (req, res) => {                       
    try {
        const users = await User.find({role:'member'}).select("-password")

        const usersWithTaskCounts=await Promise.all(users.map(async(user)=>{
            const pendingTasks=await Task.countDocuments({assignedTo:user._id,status:"Pending"})
            const inProgressTask=await Task.countDocuments({assignedTo:user._id,status:"In progress"})
            const completedTasks=await Task.countDocuments({assignedTo:user._id,status:"Completed"})

            return {
            ...user._doc,
            pendingTasks,
            inProgressTask,
            completedTasks
        }

        }))
        return res.status(200).json(usersWithTaskCounts);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get users" });
    }
};

export const getUserById = async (req,res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}
// export const deleteUser = async () => {

// }
// // export const getUsers=async()=>{

// // }
