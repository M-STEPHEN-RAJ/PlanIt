import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [events, setEvents] = useState([
    // { id: "1", title: "Team Meeting", date: "2025-08-21" },
    // { id: "2", title: "Project Deadline", date: "2025-08-25" },
  ]);

  const handleDateClick = (info) => {
    const title = prompt("Enter Task Title:");
    if (title) {
      setEvents([...events, { id: Date.now().toString(), title, date: info.dateStr }]);
    }
  };

  const handleEventClick = (info) => {
    if (window.confirm(`Remove task "${info.event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== info.event.id));
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
            events={events}
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
    </div>
  );
};

export default Calendar;
