import express from 'express';
import { createProject, getUserProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController.js';
import Auth from '../middleware/auth.js'

const router = express.Router();

router.post("/", Auth, createProject);
router.get("/", Auth, getUserProjects);
router.delete("/:id", Auth, deleteProject);
router.patch("/:id", Auth, updateProject);
router.get("/:id", Auth, getProjectById);

export default router;