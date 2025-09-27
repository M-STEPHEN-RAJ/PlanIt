import Event from "../models/Event.js";

export const createEvent = async(req, res) => {
    try {
        const { title, date, meetLink } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: "Fill all the fields!" });
        }

        const event = new Event({ title, date, meetLink });
        const savedEvent = await event.save();

        res.status(201).json(savedEvent);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create event!", error: error.message });
    }
}

export const getEvents = async (req, res) => {
    try {

        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);

    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch events", error: error.message });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, date, meetLink } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        if (!title || !date) {
            return res.status(400).json({ message: "Title and date are required!" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { title, date, meetLink },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found!" });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Failed to update event", error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {

        const {eventId} = req.params;

        if(!eventId) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found!" });
        }

        res.json({ message: "Event deleted successfully!" });
        
    } 
    catch (error) {
        res.status(500).json({ message: "Failed to delete events", error: error.message });
    }
}