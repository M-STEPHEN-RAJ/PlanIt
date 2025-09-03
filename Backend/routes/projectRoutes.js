import express from 'express';
import { createProject, getUserProjects, getProjectById } from '../controllers/projectController.js';
import Auth from '../middleware/auth.js'

const router = express.Router();

router.post("/", Auth, createProject);
router.get("/", Auth, getUserProjects);

router.get("/:id", Auth, getProjectById);

export default router;