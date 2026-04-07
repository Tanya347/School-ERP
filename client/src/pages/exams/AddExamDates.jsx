import './addExamDates.scss';

import EventBusyIcon from '@mui/icons-material/EventBusy';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux"

import { getClassExamDates } from '../../utils/endpoints/get';
import { updateExamDates } from '../../utils/endpoints/put';
import { clearExamDatesForClass } from '../../utils/endpoints/delete';
import axiosInterceptor from '../../utils/shared/axiosInterceptor';
import { checkSuccess } from '../../utils/shared/commons';

import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import ConfirmPopup from '../../components/shared/confirmationPopup/ConfirmatinPopup';
import Dropdown from '../../components/shared/dropdown/Dropdown';
import Loader from "../../components/shared/loader/Loader"

const AddExamDates = () => {

  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const { classId } = useParams();
  const navigate = useNavigate();

  const classes = useSelector(state => state.admin.classes);

  // Set class from URL param when classes load
  useEffect(() => {
    if (classId && classes?.length > 0) {
      const selected = classes.find(c => c._id === classId);
      if (selected) {
        setSelectedClass(classId);
      }
    }
  }, [classId, classes]);

  const handleClassSelection = (e) => {
    const classId = e.target.value;
    if (classId) {
      navigate(`/admin/exams/dates/${classId}`);
    } else {
      setSelectedClass('');
      setExamDates({});
      setCourses([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass) return;

      try {
        const examRes = await axiosInterceptor.get(
          getClassExamDates(selectedClass)
        );

        if (checkSuccess(examRes.data.status)) {
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
        toast.error(
          <div>
            <strong>Failed to fetch exam dates</strong>
            <div>{err.response?.data?.message || err.message || 'Unknown error'}</div>
          </div>
        );
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
      console.log(selectedClass)
      console.log(exams)
      const res = await axiosInterceptor.put(updateExamDates, {
        classID: selectedClass,
        exams,
      });

      if(checkSuccess(res.data.status)) {
        toast.success("Dates added successfully");
      }
    } catch (err) {
      console.log(err)
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
        const res = await axiosInterceptor.delete(clearExamDatesForClass(selectedClass));
        if(checkSuccess(res.data.status)) {
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
          id="classID"
          title="Choose Class"
          options={classes}
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
          { loading && <Loader text="clearing dates"/>}
                    <button onClick={submitExamDates} className="form-btn">Create Exam Plan</button>
          
          {loading && <Loader text="clearing dates"/>}
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