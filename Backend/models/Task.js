import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        title: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["assigned", "progress", "review", "done"],
            default: "assigned",
        },
        dueDate: { type: Date },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },     
    }, { timestamps: true }
)

const Task = mongoose.model("Task", taskSchema);

export default Task;