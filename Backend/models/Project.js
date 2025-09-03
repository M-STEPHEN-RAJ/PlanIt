import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["assigned", "progress", "review", "done"],
            default: "assigned"
        },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        progress: { type: Number, min: 0, max: 100, default: 0 },
    },
    { timestamps: true }
)

const Project = mongoose.model("Project", projectSchema);

export default Project;