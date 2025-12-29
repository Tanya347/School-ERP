import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calender.scss'; // Custom styles for highlighting and popup
import useFetch from '../../config/service/useFetch';
import { getDatatableURL } from '../../config/endpoints/get';
import { toast } from "react-toastify";

const EventCalender = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(null);
  const { data: eventData, error: eventError } = useFetch(getDatatableURL("events"));

  if (eventError) {
    toast.error(
      <div>
        <strong>Events Fetch Failed</strong>
        <div>{eventError.response?.data?.message || eventError.message || 'Unknown error'}</div>
      </div>
    );
  }

  console.log(eventData)

  useEffect(() => {
    if (!eventData) return;
    const rawevents = eventData.map((event) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    }));
    setEvents(rawevents);
  }, [eventData]);

  const isEventDate = (date) =>
    events?.find(
      (event) =>
        date >= new Date(event.startDate.toDateString()) &&
        date <= new Date(event.endDate.toDateString())
    );

  const handleDateClick = (date) => {
    const isSameDate =
      selectedDate && selectedDate.toDateString() === date.toDateString();
    setSelectedDate(isSameDate ? null : date); // toggle behavior
  };
  return (
    <div className="calendar-container">
      <Calendar
        tileContent={({ date, view }) => {
          const event = isEventDate(date);
          return view === 'month' && event ? (
            <div className="event-dot"></div>
          ) : null;
        }}
        tileClassName={({ date }) => {
          const isEvent = isEventDate(date);
          const isSelected =
            selectedDate && selectedDate.toDateString() === date.toDateString();
          if (isEvent && !isSelected) return 'highlight';
          if (isSelected) return 'selected-event';
          return null;
        }}
        onClickDay={handleDateClick}
      />

      {selectedDate && isEventDate(selectedDate) && (
        <div className="event-popup">
          {(() => {
            const event = isEventDate(selectedDate);
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);

            const timeRange = `${start.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${end.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`;

            return (
              <>
                <strong>{event.name}</strong>
                <p><b>Time:</b> {timeRange}</p>
                <p><b>Venue:</b> {event.venue}</p>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EventCalender;
