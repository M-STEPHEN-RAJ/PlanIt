import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import memberRoutes from './routes/memberRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        "https://planit-25.web.app",
        "http://planit-25.web.app"
    ],
    credentials: true
}));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("Server is Live!");
})

app.use('/api/users', userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/members', memberRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server run in http://localhost:${PORT}`);    
})