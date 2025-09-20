import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {
    try {
        const { title, status, assignees, priority, dueDate } = req.body;

        const projectExists = await Project.findById(req.params.projectId);
        if (!projectExists) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const task = await Task.create({
            projectId: req.params.projectId,
            title,
            status,
            assignees,
            priority,
            dueDate,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTasksByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await Task.find({ projectId })
            .populate("assignees", "avatar name email")
            .populate("createdBy", "avatar name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });  
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });        
    }
}

export const deleteTask = async (req, res) => {
    try {
        const {taskId} = req.body;

        if (!taskId) {
            return res.status(400).json({ success: false, message: "No Tasks found!" });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ success: false, message: "No Tasks found!" });
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Only Project Manager can Delete tasks!" });
        }

        await task.deleteOne();

        res.status(200).json({ success: true, message: "Task deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}