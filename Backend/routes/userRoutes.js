import express from "express"
import { SignUp, Login, getMe, updateAvatar } from "../controllers/userController.js"
import Auth from '../middleware/auth.js'
import upload from "../middleware/upload.js";

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.get('/me', Auth, getMe);

router.put("/avatar", Auth, upload.single("avatar"), updateAvatar);

export default router;