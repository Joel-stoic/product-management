import { Task } from "../models/task.model"
import { User } from "../models/user.model"
import excels from "exceljs"

export const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email")

        const workbook = new excels.Workbook();
        const worksheet = workbook.addWorksheet("Task Report")

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", keys: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned TO", key: "assignedTo", width: 30 },
        ]
        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
                .map((user) => `${user.name} (${user.email})`)
                .join(", ");
            worksheet.addRow({
                _id: task.title,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned"
            })
        })
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader( 
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
        } catch (error) {
            res.status(500).json({ message: "Error in exporting Task", error: error.message })
        }
    }


export const exportUsersReport = async (req, res) => {
        try {
            const users=await User.find().select("name email_id").lean();
            const userTasks=await Task.find().populate(
                "assignedTo",
                "name email_id"
            )
            const userTaskMap={};
            users.forEach((user)=>{
                userTaskMap[user._id]={
                    name:user.name,
                    email:user.email,
                    taskCount:0,
                    pendingTasks:0,
                    inProgress:0,
                    completedTasks:0,

                }
            })
            userTasks.forEach((task)=>{
                if(task.assignedTo){
                    task.assignedTo.forEach((assignedUser)=>{
                        if(userTaskMap[assignedUser._id]){
                            userTaskMap[assignedUser._id].taskCount +=1;
                            if(task.status === "Pending"){
                                userTaskMap[assignedUser._id].pendingTasks +=1
                            }else if(task.status === "In Progress"){
                                userTaskMap[assignedUser.user._id].inProgressTasks +=1
                            }else if(task.status === "Completed"){
                                userTaskMap[assignedUser._id].completedTasks +=1
                            }
                        }
                    }
                    )}
            })
            const workbook=new excels.Workbook()
            const worksheet=workbook.addWorksheet("User Task Report");

            worksheet.columns=[
                {header:"User Name",key:"name",width:30},
                {header:"Email",key:"email",width:40},
                {header:"Total Assigned Task",key:"taskCount",width:20},
                {header:"Pending Task",key:"pendingTasks",width:20},
                {header:"In Progress Tasks",key:"inProgressTasks",width:20},
                {width:"completedTasks",key:"completedTasks",width:20},

            ]
            Object.values(userTaskMap).forEach((user)=>{
                worksheet.addRow(user);
            })

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            res.setHeader(
                "Content-Disposition",
                'attachment;filename="user_report.xlsx"'
            );
            return workbook.xlsx.write(res).then(()=>{
                res.end()
            })
            
        } catch (error) {
            res.status(500).json({ message: "Error in exporting Report", error: error.message })
        }
    }



// 1:34:50