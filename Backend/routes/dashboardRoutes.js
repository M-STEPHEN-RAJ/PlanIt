import express from "express";
import { getDashboardCard } from "../controllers/dashboardController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", Auth, getDashboardCard);

export default router;
