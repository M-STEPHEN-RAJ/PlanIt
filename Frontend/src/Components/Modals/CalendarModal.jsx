import React, { useState, useEffect } from "react";
import close from "../../assets/close-icon.png";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from '../../utils/api'

const CalendarModal = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  eventToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "");
      setMeetLink(eventToEdit.extendedProps?.meetLink || "");
    } else {
      setTitle("");
      setMeetLink("");
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No user found!");
        setLoading(false);
        return;
      }

      // Convert date to ISO format
      const [day, month, year] = selectedDate.split("-");
      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      let res;
      if (eventToEdit) {
        // UPDATE event
        res = await axios.put(
          `${API_BASE_URL}/api/events/${eventToEdit.id}`,
          { title, date: isoDate, meetLink },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Event updated successfully!");
      } else {
        // CREATE new event
        res = await axios.post(
          `${API_BASE_URL}/api/events`,
          { title, date: isoDate, meetLink },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Event added successfully!");
      }

      onSave(res.data);
      setTitle("");
      setMeetLink("");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        eventToEdit ? "Failed to update event" : "Failed to add event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white space-y-3 p-6 rounded-lg w-full max-w-[450px] relative shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {eventToEdit ? "Edit Event" : "Add Event"}
          </h2>
          <div
            onClick={onClose}
            className="w-fit p-2 hover:bg-gray-500/10 rounded-full cursor-pointer"
          >
            <img src={close} className="w-4" alt="Close" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            <span className="text-base text-gray-700 font-medium">
              Date:&nbsp;
            </span>
            {new Date(selectedDate).toLocaleDateString()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm">Event Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
                placeholder="Enter event"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm">Meet Link</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
                placeholder="Enter meeting link (optional)"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="font-medium border border-gray-300 w-20 py-1 rounded-md cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`w-20 py-1 rounded-md font-medium text-white bg-black hover:bg-gray-800 flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
