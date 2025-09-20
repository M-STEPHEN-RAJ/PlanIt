import Member from "../models/Member.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const selfId = req.user._id;

        const users = await User.find({ _id: { $ne: selfId } }).select("name email avatar");

        res.json({ users });        
    } 
    catch (error) {
        res.status(500).json({ message: "Failed to Fetch Members!" });        
    }
}