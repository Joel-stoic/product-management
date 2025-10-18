import { Task } from "../models/task.model.js"

export const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments()
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTask = await Task.countDocuments({ status: "Completed" })
        const overdueTasks = await Task.countDocuments({ status: { $ne: "Completed" }, dueDate: { $lt: new Date() } })


        const taskStatus = ["Pending", "In progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "status",
                    count: { $sum: 1 },
                }
            }
        ]);
        const taskDistribution = taskStatus.reduce((acc, status) => {
            const formattedKey = status.replace(/\s*/g, "")
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;

            return acc
        }, {})
        taskDistribution["ALL"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            {
                $group: {
                    _id: "priority",
                    count: { $sum: 1 }
                }
            }
        ])
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
            return acc
        }, {})
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("tittle status priority dueDate createdAt")

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTask,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
export const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatus = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatus.reduce((acc, status) => {
      const formattedKey = status.replace(/\s*/g, "");
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["ALL"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTask = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
            statusSummary: {
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
export const getTaskById = async (req, res) => {

    try {
        const task = await Task.findById(req.params.id)
            .populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        if (!task) return res.status(404).json({ message: "Task not found" })
        res.json(task)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
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

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Find task
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update fields
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachment = req.body.attachment || task.attachment;

        // Validate and update assignedTo
        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        // Save
        const updatedTask = await task.save();

        res.json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: "Task not found" })

        await task.deleteOne();
        res.json({ message: "Task deleted sucessfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
export const updateTaskStatus = () => {

}
export const updateTaskChecklist = () => {

}


// 1:24:46