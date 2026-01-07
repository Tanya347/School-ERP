import 'react-calendar/dist/Calendar.css';
import './calender.scss';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import useFetch from '../../utils/service/useFetch';
import { getDatatableURL } from '../../utils/endpoints/get';
import { getTimeRange, isEventDate } from "../../utils/shared/commons";
import { eventsConst } from "../../utils/shared/constants";

const EventCalender = () => {
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(null);

  const { data: eventData } = useFetch(getDatatableURL(eventsConst));

  useEffect(() => {
    if (!eventData) return;
    const rawevents = eventData.map((event) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    }));
    setEvents(rawevents);
  }, [eventData]);

  const handleDateClick = (date) => {
    const isSameDate =
      selectedDate && selectedDate.toDateString() === date.toDateString();
    setSelectedDate(isSameDate ? null : date);
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileContent={({ date, view }) => {
          const event = isEventDate(date, events);
          return view === 'month' && event ? (
            <div className="event-dot"></div>
          ) : null;
        }}
        tileClassName={({ date }) => {
          const isEvent = isEventDate(date, events);
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

            const timeRange = getTimeRange(start, end);

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
