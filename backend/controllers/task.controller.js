import { Task } from "../models/task.model.js"


export const getDashboardData = () => {
    try {

    } catch (error) {

    }
}
export const getUserDashboardData = () => {
    try {

    } catch (error) {

    }
}
export const getTask = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (!status) {
            filter.status = status
        }
        let tasks;

        if (req.user.role === 'admin') {
            tasks = await Task.find({ filter }).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedCount: completedCount };
            })
        )
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        )
        const pendingTasks = await Task.countDocuments(
            ...filter,
            { status: "Pending" },
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        )
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })
        res.json({
            tasks,
            statusSummary:{
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
export const getTaskById = () => {

}


export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;

        // Validate 'assignedTo' is an array
        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({
                message: "assignedTo must be an array of user IDs"
            });
        }

        // Create task
        const task = await Task.create({
            title, // consider changing to 'title'
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist
        });

        // Respond with success
        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({
            message: "An error occurred while creating the task",
            error: error.message
        });
    }
};

export const updateTask = () => {
    try {

    } catch (error) {

    }
}
export const deleteTask = () => {

}
export const updateTaskStatus = () => {

}
export const updateTaskChecklist = () => {

}
