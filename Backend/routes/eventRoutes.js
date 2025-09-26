import express from 'express'
import { createEvent, getEvents, deleteEvent } from '../controllers/eventController.js'

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.delete("/:eventId", deleteEvent);

export default router;