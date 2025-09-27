import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarModal from "../Components/Modals/CalendarModal";
import DeleteModal from "../Components/Modals/DeleteModal";
import { API_BASE_URL } from "../utils/api";

const EventDropdown = ({ event, onEdit, onJoin, onDelete, onClose }) => {
  return (
    <div className="absolute text-sm bg-white border border-gray-300 rounded-md w-32 z-50">
      <button
        onClick={() => { onEdit(event); onClose(); }}
        className="w-full text-left px-3 py-1 hover:bg-gray-100 cursor-pointer"
      >
        Edit
      </button>
      {event.extendedProps.meetLink && (
        <button
          onClick={() => { onJoin(event.extendedProps.meetLink); onClose(); }}
          className="w-full text-left px-3 py-1 hover:bg-gray-100 cursor-pointer"
        >
          Join
        </button>
      )}
      <button
        onClick={() => { onDelete(event); onClose(); }}
        className="w-full text-left px-3 py-1 hover:bg-gray-100 text-red-500 cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
};

const Calendar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [reload, setReload] = useState(false);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownEvent, setDropdownEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No user found!");
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
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
    meetLink: e.meetLink || "",
  }));

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    const rect = info.jsEvent.target.getBoundingClientRect();
    setDropdownEvent(info.event);
    setDropdownPosition({ top: rect.bottom + 5, left: rect.left });
    setDropdownOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    const eventDate = event.startStr || selectedDate;
    setSelectedDate(eventDate);

    setModalOpen(true);
  };

  const handleJoin = (link) => {
    window.open(link, "_blank");
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No user found!");
        setDeleteModalOpen(false);
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/api/events/${selectedEvent.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Event deleted successfully!");
      setReload((prev) => !prev);
      setDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex justify-center overflow-y-auto">
      <div className="w-full max-w-[1200px] flex flex-col gap-5 p-3">
        {loading ? (
          <>
            <div className="h-4 w-20 bg-gray-300 rounded-md mt-3 animate-pulse -mb-2"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex">
                  <div className="h-8 w-20 bg-gray-300 rounded-l-md mt-3 animate-pulse"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded-r-md mt-3 animate-pulse"></div>
                </div>
                <div className="">
                  <div className="h-7 w-20 bg-gray-300 rounded-md mt-3 animate-pulse"></div>
                </div>
              </div>
              <div className="">
                <div className="h-7 w-48 bg-gray-300 rounded-md mt-3 animate-pulse"></div>
              </div>
              <div className="flex">
                <div className="h-8 w-20 bg-gray-300 rounded-l-md mt-3 animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-300 rounded-r-md mt-3 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-0.5 h-[435px] w-full mt-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[168px] h-8 animate-pulse bg-gray-300"
                  ></div>
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                {Array.from({ length: 6 }).map((_, parentIdx) => (
                  <div key={parentIdx} className="flex gap-0.5">
                    {Array.from({ length: 7 }).map((_, childIdx) => (
                      <div
                        key={childIdx}
                        className="w-[168px] h-16 animate-pulse bg-gray-300"
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <CalendarModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => setReload((prev) => !prev)}
        selectedDate={selectedDate}
        eventToEdit={selectedEvent}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        message={`Are you sure you want to delete "${selectedEvent?.title}"?`}
        onConfirm={confirmDelete}
      />

      {dropdownOpen && dropdownEvent && (
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 1000,
          }}
        >
          <EventDropdown
            event={dropdownEvent}
            onEdit={handleEdit}
            onJoin={handleJoin}
            onDelete={handleDelete}
            onClose={() => setDropdownOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
