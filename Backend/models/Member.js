import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
    {
        userName: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        joinedAt: { type: Date, default: Date.now },
    }
)

const Member = mongoose.model("Member", memberSchema);

export default Member;