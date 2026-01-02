import "./newTimeTable.scss";

import EventBusyIcon from '@mui/icons-material/EventBusy';

import { useState, useEffect } from 'react';
import {toast} from "react-toastify"
import axios from 'axios';

import { getClasses, getClassCourses, getTimeTableURL } from "../../config/endpoints/get";
import { getClearTimetableForClass } from '../../config/endpoints/delete';
import { periodTimes, days, periods } from '../../config/commons';

import ConfirmPopup from '../../components/shared/confirmationPopup/ConfirmatinPopup';
import Loader from '../../components/shared/loader/Loader';
import Dropdown from '../../components/shared/dropdown/Dropdown';

const NewTimeTable = () => {

  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [slots, setSlots] = useState({});
  const [existingSlots, setExistingSlots] = useState({});
  const [clearedSlots, setClearedSlots] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [clearloading, setClearloading] = useState(false);
  const [saveloading, setSaveloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClass) {
        try {
          const coursesRes = await axios.get(
            process.env.REACT_APP_API_URL + getClassCourses(selectedClass, "courses"),
            { withCredentials: true }
          );
          setCourses(coursesRes.data.data);

          const timetableRes = await axios.get(
            process.env.REACT_APP_API_URL + getTimeTableURL(selectedClass, 'class'),
            { withCredentials: true }
          );
          const timetableArray = timetableRes.data.data;
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
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [selectedClass]);

  const handleCourseChange = (day, period, courseId) => {
    setSlots(prev => ({
      ...prev,
      [`${day}_${period}`]: courseId
    }));
  };

  const handleClassSelection = (e) => {
    setSelectedClass(e.target.value)
    setCourses([]);
  }

  const handleClearAllSlots = async () => {
    if (!selectedClass) return;
    setConfirmMessage(`Are you sure you want to clear all timetable records for this class?`);
    setConfirmAction(() => async () => {
      setClearloading(true);
      try {
        const res = await axios.delete(getClearTimetableForClass(selectedClass), { withCredentials: true });
        
        if(res.data.status === 'success') {
          setClearedSlots({});
          setSlots({});
          setExistingSlots({});
          toast.success(`Slots cleared successfully!`);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to clear slots.");
      } finally {
        setShowConfirm(false);
        setClearloading(false);
      }
    });

    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    const slotData = [];
    setSaveloading(true);
    try {
      for (const key in slots) {
        const [day, period] = key.split("_");
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
          faculty: course.teacher,
        });
      }

      if (slotData.length === 0) {
        toast.error("No timetable slots selected.");
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/timetables/bulkCreate`,
        { slots: slotData },
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        toast.success("Timetable created successfully!");
        window.location.reload(); // Reload to reflect changes
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to create timetable. Please try again.";

      toast.error(errorMessage);
    } finally {
      setSaveloading(false);
    }
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
          value={selectedClass}
        />
      </div>

      {selectedClass && courses.length > 0 ? (
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
                  <td
                    key={period}
                    className={`slot-cell ${
                      slots[`${day}_${period}`] ? "selected" : ""
                    } ${
                      existingSlots[`${day}_${period}`] &&
                      !clearedSlots[`${day}_${period}`]
                        ? "existing"
                        : ""
                    }`}
                  >
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
                      <option value="">-- Free --</option>
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
      ) : (
        <>
          <div className="timetable-table">
            <div className="no-selection">
              <EventBusyIcon className='no-class-icon'/>
              {selectedClass ? (<><p>no courses available for this class</p></>) : (<><p>please select a class to view it's timetable</p></>)}
            </div>
          </div>
        </>
      )}

      <div className="buttons-container">

        {selectedClass && (
          <>
            {clearloading && <Loader text="clearing all slots..." />}
            <button
              className="form-btn danger-btn"
              onClick={handleClearAllSlots}
            >
              Clear All Slots for this class
            </button>
          </>
        )}
        {selectedClass && (<>
          {saveloading && <Loader text="saving slots..." />}
          <button className='form-btn' onClick={handleSubmit}>Save Timetable</button>
        </>)}
      </div>

      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}

export default NewTimeTable