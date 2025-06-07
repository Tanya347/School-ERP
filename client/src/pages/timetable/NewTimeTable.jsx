import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from '../../components/dropdown/Dropdown';
import { getClasses, getClassCourses, getTimeTableURL } from "../../config/endpoints/get";
import "./newTimeTable.scss";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = Array.from({ length: 8 }, (_, i) => i + 1);

const NewTimeTable = () => {

  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState({});
  const [existingSlots, setExistingSlots] = useState({});

  const periodTimes = {
    1: { start: "08:00", end: "08:45" },
    2: { start: "08:50", end: "09:35" },
    3: { start: "09:40", end: "10:25" },
    4: { start: "10:30", end: "11:15" },
    5: { start: "11:20", end: "12:05" },
    6: { start: "12:10", end: "12:55" },
    7: { start: "13:00", end: "13:45" },
    8: { start: "13:50", end: "14:35" },
  };

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
                    {existingSlots[`${day}_${period}`] && (
                      <div className="existing-slot">
                        <p>{existingSlots[`${day}_${period}`].courseName}</p>
                        <span>({existingSlots[`${day}_${period}`].facultyName})</span>
                      </div>
                    )}
                    <select
                      value={slots[`${day}_${period}`] || ''}
                      onChange={(e) => handleCourseChange(day, period, e.target.value)}
                    >
                      <option value="">--</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedClass && <button className='form-btn' onClick={handleSubmit}>Save Timetable</button>}

    </div>
  )
}

export default NewTimeTable