import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const getDashboardCard = async (req, res) => {
    try {
        const userId = req.user._id;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const completedCount = await Task.countDocuments({
            status: "done",
            updatedAt: { $gte: sevenDaysAgo },
            assignees: userId,
        });

        const updatedCount = await Task.countDocuments({
            updatedAt: { $gte: sevenDaysAgo },
            assignees: userId,
        });

        const createdCount = await Task.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
            assignees: userId,
        });

        const dueSoonTasks = await Task.find({
            dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7*24*60*60*1000) },
            assignees: userId
        }).sort({ dueDate: 1 }).limit(5);

        const recentProjects = await Project.find({
            $or: [
                { members: userId },
                { createdBy: userId }
            ]
        })
        .sort({ createdAt: 1 }) 
        .limit(3)
        .select("name status members progress createdBy createdAt")
        .populate("members", "name avatar")
        .populate("createdBy", "name avatar");

        const allProjects = await Project.find({
            $or: [{ members: userId }, { createdBy: userId }],
        })
        .select("status progress createdAt")
        .populate("members", "name avatar");

        // Task Summary
        const projectIds = allProjects.map((p) => p._id);

            const taskStatus = await Task.aggregate([
            { $match: { projectId: { $in: projectIds } } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            ]);

            const taskSummary = {
            total: 0,
            assigned: 0,
            progress: 0,
            review: 0,
            done: 0,
            };

            taskStatus.forEach((item) => {
            taskSummary[item._id] = item.count;
            taskSummary.total += item.count;
        });

        res.json({
            success: true,
            summary: {
                completed: completedCount,
                updated: updatedCount,
                created: createdCount,
                dueSoon: dueSoonTasks.length
            },
            allProjects,
            recentProjects,
            tasks: taskSummary,
        })

    }

    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch data!" });
    }
}