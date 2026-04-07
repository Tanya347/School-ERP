import 'react-calendar/dist/Calendar.css';
import './calender.scss';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';

import { getTaskCalenderURL, getTestCalenderURL } from '../../utils/endpoints/get';
import { isEventDate } from "../../utils/shared/commons";
import axiosInterceptor from '../../utils/shared/axiosInterceptor';

const EventCalender = () => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [tests, setTests] = useState(null);

  const { user } = useSelector(state => state.auth);

  // Fetch tasks and tests for the calendar
  useEffect(() => {
    if (!user) return;

    const fetchCalendarData = async () => {
      try {
        // Fetch tasks
        const taskUrl = getTaskCalenderURL(user);
        if (taskUrl) {
          const taskRes = await axiosInterceptor.get(taskUrl);
          if (taskRes.data?.data) {
            setTasks(taskRes.data.data.map((task) => ({
              ...task,
              type: 'task',
              date: new Date(task.deadline),
              isPast: new Date() > new Date(task.deadline),
            })));
          }
        }

        // Fetch tests
        const testUrl = getTestCalenderURL(user);
        if (testUrl) {
          const testRes = await axiosInterceptor.get(testUrl);
          if (testRes.data?.data) {
            setTests(testRes.data.data.map((test) => ({
              ...test,
              type: 'test',
              date: new Date(test.date),
              isPast: new Date() > new Date(test.date),
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching calendar data:', err);
      }
    };

    fetchCalendarData();
  }, [user]);

  const handleDateClick = (date) => {
    const isSameDate =
      selectedDate && selectedDate.toDateString() === date.toDateString();
    setSelectedDate(isSameDate ? null : date);
  };

  const getTimeRange = (start, end) => {
    return `${start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })} - ${end.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  // Get items for a specific date
  const getItemsForDate = (date) => {
    const items = [];

    // Check tasks
    if (tasks) {
      tasks.forEach((task) => {
        const taskDate = new Date(task.date);
        if (taskDate.toDateString() === date.toDateString()) {
          items.push(task);
        }
      });
    }

    // Check tests
    if (tests) {
      tests.forEach((test) => {
        const testDate = new Date(test.date);
        if (testDate.toDateString() === date.toDateString()) {
          items.push(test);
        }
      });
    }

    return items;
  };

  // Get status badge for an item
  const getStatusBadge = (item) => {
    if (item.itemType === 'event') {
      return item.isPast ? <span className="status-badge past">Past</span> : null;
    }
    if (item.type === 'task') {
      return item.isPast ? <span className="status-badge past">Overdue</span> : null;
    }
    if (item.type === 'test') {
      if (item.state === 'canceled') return <span className="status-badge cancelled">Cancelled</span>;
      if (item.state === 'completed' || item.isPast) return <span className="status-badge completed">Completed</span>;
      return <span className="status-badge pending">Pending</span>;
    }
    return null;
  };

  // Get tile class based on items
  const getTileClass = (date) => {
    const items = getItemsForDate(date);
    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

    if (items.length === 0) return isSelected ? 'selected-event' : null;

    // Priority: cancelled > overdue/past > completed > pending > event
    const hasCancelled = items.some((i) => i.type === 'test' && i.state === 'canceled');
    const hasOverdue = items.some((i) => i.isPast || (i.type === 'task' && i.isPast));
    const hasCompleted = items.some((i) =>
      (i.type === 'test' && i.state === 'completed') || i.isPast
    );

    if (isSelected) return 'selected-event';
    if (hasCancelled) return 'tile-cancelled';
    if (hasOverdue) return 'tile-overdue';
    if (hasCompleted) return 'tile-completed';
    return 'highlight';
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;
          const items = getItemsForDate(date);
          if (items.length === 0) return null;

          return (
            <div className="calendar-dots">
              {items.map((item, idx) => {
                let dotClass = 'item-dot';
                if (item.itemType === 'event') dotClass += ' event-dot';
                else if (item.type === 'task') dotClass += item.isPast ? ' task-overdue-dot' : ' task-dot';
                else if (item.type === 'test') {
                  if (item.state === 'canceled') dotClass += ' test-cancelled-dot';
                  else if (item.state === 'completed' || item.isPast) dotClass += ' test-completed-dot';
                  else dotClass += ' test-pending-dot';
                }
                return <div key={idx} className={dotClass}></div>;
              })}
            </div>
          );
        }}
        tileClassName={({ date }) => getTileClass(date)}
        onClickDay={handleDateClick}
      />

      {selectedDate && getItemsForDate(selectedDate).length > 0 && (
        <div className="event-popup">
          {getItemsForDate(selectedDate).map((item, idx) => {
            if (item.itemType === 'event') {
              const start = new Date(item?.startDate);
              const end = new Date(item?.endDate);
              const timeRange = getTimeRange(start, end);

              return (
                <div key={idx} className="popup-item">
                  <strong>📅 {item?.name}</strong>
                  {getStatusBadge(item)}
                  <p><b>Time:</b> {timeRange}</p>
                  <p><b>Venue:</b> {item?.venue}</p>
                </div>
              );
            }

            if (item.type === 'task') {
              return (
                <div key={idx} className="popup-item">
                  <strong>📝 {item?.title}</strong>
                  {getStatusBadge(item)}
                  <p><b>Deadline:</b> {item?.date?.toLocaleString()}</p>
                </div>
              );
            }

            if (item.type === 'test') {
              return (
                <div key={idx} className="popup-item">
                  <strong>📖 {item?.name}</strong>
                  {getStatusBadge(item)}
                  <p><b>Date:</b> {item?.date?.toLocaleString()}</p>
                  <p><b>Syllabus:</b> {item?.syllabus}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default EventCalender;
