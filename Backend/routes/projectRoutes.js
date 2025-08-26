import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', Auth, getProjects);
router.post('/', Auth, createProject);

export default router