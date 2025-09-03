import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    try {
        const { name, status, members } = req.body;

        const project = await Project.create({
            createdBy: req.user._id,
            name,
            status,
            members
        })

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        })
    } 
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({
            $or: [
                { createdBy: userId },
                { members: userId },
            ],
            })
            .populate("members", "name email")
            .populate("createdBy", "name email");

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

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("members", "name email");

            if (!project) {
                return res.status(404).json({ success: false, message: "Project not found" });
            }

            res.status(200).json({ success: true, project });       
    } 
    catch (error) {
        
    }
}