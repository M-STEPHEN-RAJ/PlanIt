import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("Server is Live!");
})

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server run in http://localhost:${PORT}`);    
})