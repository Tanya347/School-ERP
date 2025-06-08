import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useLocation } from "react-router-dom";
import "./timetable.scss"
import { periodTimes, days, periods } from '../../config/commons';
import { getTimeTableURL } from '../../config/endpoints/get';

const Timetable = () => {
  const location = useLocation();
  const [existingSlots, setExistingSlots] = useState({});
  const [className, setClassName] = useState("");
  const classId = location.pathname.split("/")[3];


  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + getTimeTableURL(classId, 'class'))
      .then(res => {
        const timetableArray = res.data.data;
        const mapped = {};
        setClassName(res.data?.data[0]?.sclass?.name);
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
  }, [classId])

  return (
    <div className='timetable-container'>
      <h1>{className} Standard</h1>
      <div>
        <table cellSpacing={10} className="table-container">
          <thead>
            <tr>
              <th>Day / Period</th>
              {periods.map(period =>
                  <th key={period}>
                    <div className='period-header' key={period}> Period {period}
                      <span className='period-time'>{`${periodTimes[period].start} - ${periodTimes[period].end}`}</span>
                    </div>
                  </th>
              )}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td>{day}</td>
                {periods.map(period => (
                  <td key={`${day}_${period}`} style={{ padding: "8px 12px" }}>
                    <div className='period-slot'>
                      {existingSlots[`${day}_${period}`] && (
                        <div className="existing-slot">
                          <p>{existingSlots[`${day}_${period}`].courseName}</p>
                          <span>({existingSlots[`${day}_${period}`].facultyName})</span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Timetable