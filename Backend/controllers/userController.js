import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import generateToken from "../utils/generateToken.js";

// user signUp
export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            avatar: "https://res.cloudinary.com/dt4ldt3x6/image/upload/v1756280549/default-profile_ewwgzp.png"
        });

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token,
            message: "User signed up successfully!"
        })
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to sign up", error: error.message });
    }
}

// user login
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        const token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token,
            message: "User logged in successfully!"
        })
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to login", error: error.message })
    }
}

// get current user
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// update avatar
export const updateAvatar = async (req, res) => {
    try {

        if(!req.file || !req.file.path) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: req.file.path },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json({
            message: "Avatar updated successfully!",
            avatar: user.avatar,
        });
        
    } 
    catch (error) {
        res.status(500).json({ message: "Failed to update Avatar!", error: error.message });        
    }
}