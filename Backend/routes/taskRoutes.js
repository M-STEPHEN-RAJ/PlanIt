import express from "express";
import { getTasksByProjectId, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/tasks/:projectId", Auth, getTasksByProjectId);
router.post("/tasks/:projectId", Auth, createTask);
router.put("/tasks/:taskId", Auth, updateTask);
router.delete("/tasks/:taskId", Auth, deleteTask);

export default router;