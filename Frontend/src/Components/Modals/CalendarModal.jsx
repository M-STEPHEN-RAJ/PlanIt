import React, { useState } from "react";
import close from "../../assets/close-icon.png";
import axios from "axios";
import { toast } from "react-hot-toast";

const CalendarModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

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

      // POST request to backend
      const res = await axios.post(
        "http://localhost:5000/api/events",
        { title, date: isoDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSave(res.data); // Pass the newly created event to parent
      setTitle("");
      onClose();
      toast.success("Event added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white space-y-3 p-6 rounded-lg w-full max-w-[400px] relative shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Event</h2>
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
            {selectedDate}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-2 py-1 outline-none"
              placeholder="Enter event"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />

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
                className={`
                    w-20 py-1 rounded-md font-medium text-white
                    bg-black hover:bg-gray-800
                    flex items-center justify-center
                    gap-2
                    ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                `}
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
