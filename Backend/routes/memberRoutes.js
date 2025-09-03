import express from "express";
import { getAllUsers } from "../controllers/memberController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", Auth, getAllUsers);

export default router;