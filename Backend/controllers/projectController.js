import Project from '../models/Project.js';

// add projects
export const createProject = async (req, res) => {
    try {
        const { title, status, members } = req.body;

        const project = new Project({
            title,
            status,
            members
        })

        await project.save();

        res.status(200).json(project);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to create project!", error: error.message })
    }
}

// get projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
          .populate("members", "name email")
          .sort({ createdAt: -1 });

        res.status(200).json(projects);
    }
    catch (error) { 
        return res.status(500).json({ message: "Failed to fetch projects!", error: error.message })
    }
}