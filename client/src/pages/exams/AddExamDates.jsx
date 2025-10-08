import { useEffect, useState } from 'react';
import Dropdown from '../../components/dropdown/Dropdown';
import { getClasses } from '../../config/endpoints/get';
import DatePickerComponent from "../../components/datepicker/Datepicker";
import './addExamDates.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const AddExamDates = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [courses, setCourses] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClassSelection = (e) => {
    setSelectedClass(e.target.value);
    setExamDates({});
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClass) {
        try {
          const examRes = await axios.get(
            process.env.REACT_APP_API_URL + `/courses/exam/${selectedClass}`,
            { withCredentials: true }
          );
          if (examRes.data.status === "success") {
            setCourses(examRes.data.data);
            // Populate examDates state if examDate exists for any course
            const initialExamDates = {};
            examRes.data.data.forEach(course => {
              if (course.examDate) {
                initialExamDates[course._id] = new Date(course.examDate);
              }
            });
            setExamDates(initialExamDates);
            console.log(examDates)
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchData();
  }, [selectedClass, examDates]);

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
      const res = await axios.put(process.env.REACT_APP_API_URL + "/courses/exam/setdates", {
        classId: selectedClass,
        exams,
      });

      if(res.data.status === 'success') {
        toast.success("Dates added successfully");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to add dates`;
      toast.error(errorMessage);
      console.error(err);
      return err;
    } finally {
      setLoading(false);
    }
  }

  const clearExamDates = async () => {
    if(!selectedClass) return;
    setLoading(true);
    try {
      const res = await axios.delete(process.env.REACT_APP_API_URL + `/courses/exam/clear/${selectedClass}`, { withCredentials: true });
      if(res.data.status === 'success') {
        setExamDates({});
        toast.success("Exam dates cleared successfully");
      }
    }
    catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to clear exam dates`;
      toast.error(errorMessage);
      console.error(err);
      return err;
    } finally {
      setLoading(false);
    }
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
        />
      </div>
      {selectedClass && (
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
            {courses.map(course => (
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
        </>
      )}
    </div>
  )
}

export default AddExamDates