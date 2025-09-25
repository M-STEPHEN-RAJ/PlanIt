import Project from "../models/Project.js";
import Task from "../models/Task.js";

// Map task status to numeric progress
const statusProgressMap = {
    assigned: 0,
    progress: 33.33,
    review: 66.66,
    done: 100
};

// Calculate project progress based on tasks
const calculateProjectProgress = async (projectId) => {
    const tasks = await Task.find({ projectId });

    if (!tasks.length) return 0;

    const totalProgress = tasks.reduce((sum, task) => {
        return sum + (statusProgressMap[task.status] || 0);
    }, 0);

    const averageProgress = totalProgress / tasks.length;

    // Update project progress field in DB
    await Project.findByIdAndUpdate(projectId, { progress: averageProgress });

    return averageProgress;
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { name, status, members } = req.body;

        const project = await Project.create({
            createdBy: req.user._id,
            name,
            status,
            members
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } 
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get all projects for a user
export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({
            $or: [
                { createdBy: userId },
                { members: userId },
            ],
        })
        .populate("members", "name email avatar")
        .populate("createdBy", "name email avatar");

        // Calculate progress for each project
        for (const project of projects) {
            project.progress = await calculateProjectProgress(project._id);
        }

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } 
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get a single project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email avatar")
            .populate("members", "name email avatar");

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found!" });
        }

        // Calculate progress dynamically
        const progress = await calculateProjectProgress(project._id);
        project.progress = progress;

        res.status(200).json({ success: true, project });       
    } 
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}