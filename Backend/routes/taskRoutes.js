import express from "express";
import { getTasksByProjectId, createTask } from "../controllers/taskController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/tasks/:projectId", Auth, getTasksByProjectId);
router.post("/tasks/:projectId", Auth, createTask);

export default router;