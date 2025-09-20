import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, minlength: 8 },
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dt4ldt3x6/image/upload/v1756280549/default-profile_ewwgzp.png"
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;