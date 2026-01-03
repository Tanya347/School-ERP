import './addExamDates.scss';

import EventBusyIcon from '@mui/icons-material/EventBusy';

import { ClipLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import { getClasses, getClassExamDates } from '../../config/endpoints/get';

import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import ConfirmPopup from '../../components/shared/confirmationPopup/ConfirmatinPopup';
import Dropdown from '../../components/shared/dropdown/Dropdown';

const AddExamDates = () => {
  
  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const handleClassSelection = (e) => {
    setSelectedClass(e.target.value);
    setExamDates({});
    setCourses([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass) return;

      try {
        const examRes = await axios.get(
          getClassExamDates(selectedClass),
          { withCredentials: true }
        );

        if (examRes.data.status === "success") {
          const examList = examRes.data.data.examDates || [];

          setCourses(examList);

          const initialExamDates = {};
          examList.forEach(course => {
            if (course.examDate) {
              initialExamDates[course._id] = new Date(course.examDate);
            }
          });

          setExamDates(initialExamDates);
        }
      } catch (err) {
        toast.error("Failed to fetch exam dates");
        throw(err)
      }
    };

    fetchData();
  }, [selectedClass]);


  const handleDateChange = (courseId, date) => {
    setExamDates((prev) => ({ ...prev, [courseId]: date }));
  };

  const submitExamDates = async () => {
    const exams = Object.entries(examDates).map(([courseId, examDate]) => ({
      courseId,
      examDate,
    }));

    try {
      setLoading(true);
      const res = await axios.put(setExamDates, {
        classId: selectedClass,
        exams,
      });

      if(res.data.status === 'success') {
        toast.success("Dates added successfully");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to add dates`;
      toast.error(errorMessage);
      return err;
    } finally {
      setLoading(false);
    }
  }

  const clearExamDates = async () => {
    if(!selectedClass) return;
    setConfirmMessage(`Are you sure you want to clear all timetable records for this class?`);
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const res = await axios.delete(clearExamDates(selectedClass), { withCredentials: true });
        if(res.data.status === 'success') {
          setExamDates({});
          toast.success("Exam dates cleared successfully");
        }
      }
      catch (err) {
        const errorMessage = err.response?.data?.message || `Failed to clear exam dates`;
        toast.error(errorMessage);
        return err;
      } finally {
        setLoading(false);
        setShowConfirm(false);
      }
    })
    setShowConfirm(true);
  }

  return (
    <div className='add-exam-date-container'>
      <h1>Add Exam Date and Time</h1>
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
        <>
        <table className='exam-dates-table' cellSpacing={10}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Exam Date</th>
              <th>Exam Time</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map(course => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>
                  <DatePickerComponent
                    placeholder="Select Date"
                    selectedDate={examDates[course._id] || null}
                    onChange={date => handleDateChange(course._id, date)}
                    showTimeSelect
                  />
                </td>
                <td>
                  {examDates[course._id]
                    ? new Date(examDates[course._id]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="buttons-container">
          { loading && <div className="create-loader">
                      <ClipLoader color="black" size={30} />
                      adding dates...
                    </div>}
                    <button onClick={submitExamDates} className="form-btn">Create Exam Plan</button>
          
          {loading && <div className="create-loader">
                      <ClipLoader color="black" size={30} />
                      clearing dates...
                    </div>}
                    <button onClick={clearExamDates} className='form-btn danger-btn'>Clear Exam Dates</button>
        </div>
        </>
      ) : (
              <>
                <div className="exam-dates-table">
                  <div className="no-selection">
                    <EventBusyIcon className='no-class-icon'/>
                    {selectedClass ? (<><p>no courses available for this class</p></>) : (<><p>please select a class to view it's timetable</p></>)}
                  </div>
                </div>
              </>
            )}
      
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

export default AddExamDates