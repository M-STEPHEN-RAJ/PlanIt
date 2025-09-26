import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarModal from "../Components/Modals/CalendarModal";

const Calendar = () => {
  const navigate = useNavigate();

  const [reload, setReload] = useState(false);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No user found!");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [reload]);

  const normalizedEvents = events.map((e) => ({
    id: e._id || e.id,
    title: e.title,
    date: (() => {
      const [day, month, year] = e.date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    })(),
  }));

  // Open modal when a date is clicked
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setModalOpen(true);
  };

  // Add new event to backend and reload
  const handleSaveEvent = async (newEvent) => {
    setReload((prev) => !prev); // triggers fetchEvents via useEffect
    setModalOpen(false);
  };

  // Delete event from backend
  const handleEventClick = async (info) => {
    if (!window.confirm(`Remove task "${info.event.title}"?`)) return;

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No user found!");
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:5000/api/events/${info.event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Event deleted successfully!");
      setReload((prev) => !prev); // refresh events
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="flex-1 flex justify-center overflow-y-auto">
      <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">
        <h2 className="text-lg font-semibold">Calendar</h2>

        <div className="bg-white">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={normalizedEvents}
            eventColor="#364153"
            eventTextColor="#ffffff"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            height="500px"
          />
        </div>
      </div>

      <CalendarModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(newEvent) => setReload(prev => !prev)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;