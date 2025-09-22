import express from "express";
import { getTasksByProjectId, createTask, deleteTask } from "../controllers/taskController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/tasks/:projectId", Auth, getTasksByProjectId);
router.post("/tasks/:projectId", Auth, createTask);
router.delete("/tasks/:taskId", Auth, deleteTask);

export default router;