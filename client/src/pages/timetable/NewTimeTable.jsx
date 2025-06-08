import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from '../../components/dropdown/Dropdown';
import { getClasses, getClassCourses, getTimeTableURL } from "../../config/endpoints/get";
import "./newTimeTable.scss";
import { getClearTimetableForClass } from '../../config/endpoints/delete';
import {toast} from "react-toastify"
import { periodTimes, days, periods } from '../../config/commons';

const NewTimeTable = () => {

  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState({});
  const [existingSlots, setExistingSlots] = useState({});
  const [clearedSlots, setClearedSlots] = useState({});

  useEffect(() => {
    if (selectedClass) {
      axios.get(process.env.REACT_APP_API_URL + getClassCourses(selectedClass, "courses"))
        .then(res => setCourses(res.data.data))
        .catch(console.error);
    }

    axios.get(process.env.REACT_APP_API_URL + getTimeTableURL(selectedClass, 'class'))
      .then(res => {
        const timetableArray = res.data.data;
        const mapped = {};
        timetableArray.forEach(slot => {
          const key = `${slot.day}_${slot.period}`;
          mapped[key] = {
            courseId: slot.course._id,
            courseName: slot.course.name,
            facultyName: slot.faculty.teachername
          };
        });
        setExistingSlots(mapped);
      })
      .catch(console.error);
  }, [selectedClass]);

  const handleCourseChange = (day, period, courseId) => {
    setSlots(prev => ({
      ...prev,
      [`${day}_${period}`]: courseId
    }));
  };

  const handleClassSelection = (e) => {
    setSelectedClass(e.target.value)
  }

  const handleClearAllSlots = async () => {
    if (!selectedClass) return;

    // const confirmClear = window.confirm("Are you sure you want to clear all slots for this class?");
    // if (!confirmClear) return;

    try {
      const res = await axios.delete(getClearTimetableForClass(selectedClass), { withCredentials: true });
      setClearedSlots({});
      setSlots({});
      setExistingSlots({});

      if(res.data.status === 'success') {
        toast.success(`Slots cleared successfully!`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to clear slots.");
    }
  };

  const handleSubmit = async () => {
    const slotData = [];

    for (const key in slots) {
      const [day, period] = key.split('_');
      const course = courses.find(c => c._id === slots[key]);

      if (!course) continue;

      const { start, end } = periodTimes[period];

      slotData.push({
        day,
        period: Number(period),
        startTime: start,
        endTime: end,
        sclass: selectedClass,
        course: course._id,
        faculty: course.teacher
      });
    }
    await axios.post(process.env.REACT_APP_API_URL + '/timetables/bulkCreate', { slots: slotData });
    window.location.reload(); // Reload to reflect changes
  };

  return (
    <div className="timetable-wrapper">
      <h1>Add / Edit Timetable Slots</h1>

      <div className="class-dropdown">
        <Dropdown
          id="class"
          title="Choose Class"
          url={getClasses}
          onChange={handleClassSelection}
        />
      </div>

      {selectedClass && (
        <table className="timetable-table" cellSpacing={10} /* Add spacing between cells */>
          <thead>
            <tr>
              <th>Day / Period</th>
              {periods.map(period => <th key={period}>Period {period}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td>{day}</td>
                {periods.map(period => (
                  <td key={period} style={{ padding: "8px 12px" }}>
                    {existingSlots[`${day}_${period}`] && !clearedSlots[`${day}_${period}`] && (
                      <div className="existing-slot">
                        <p>{existingSlots[`${day}_${period}`].courseName}</p>
                        <span>({existingSlots[`${day}_${period}`].facultyName})</span>
                        <button
                          onClick={() => setClearedSlots(prev => ({ ...prev, [`${day}_${period}`]: true }))}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    {(!existingSlots[`${day}_${period}`] || clearedSlots[`${day}_${period}`]) &&(<select
                      value={slots[`${day}_${period}`] || ''}
                      onChange={(e) => handleCourseChange(day, period, e.target.value)}
                    >
                      <option value="">--</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      ))}
                    </select>)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedClass && (
        <button
          className="form-btn danger-btn"
          onClick={handleClearAllSlots}
          style={{ marginTop: "1rem", backgroundColor: "#dc3545", color: "white" }}
        >
          🧹 Clear All Slots for This Class
        </button>
      )}

      {selectedClass && <button className='form-btn' onClick={handleSubmit}>Save Timetable</button>}

    </div>
  )
}

export default NewTimeTable