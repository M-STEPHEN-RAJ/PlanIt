import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["assigned", "progress", "review", "done"],
            default: "assigned",
        },
        members: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],       
    },
    { timestamps: true }
)

const Project = mongoose.model("Project", projectSchema);

export default Project;