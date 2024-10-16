import React, { useEffect, useState } from 'react'
import "./viewTestMarks.scss"
import { useLocation } from 'react-router-dom';
import useFetch from '../../config/hooks/useFetch';
import { getSingleData } from '../../source/endpoints/get';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import { formatDate } from '../../source/endpoints/transform';

const ViewTestMarks = () => {
  const [stuData, setStuData] = useState({});
  const [marksData, setMarksData] = useState({});
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const { data } = useFetch(getSingleData(id, "tests"))
  
  useEffect(() => {
    const fetchStudents = async() => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/students/${data.sclass._id}`);
        setStuData(response.data);
      }
      catch(error) {
        console.error("Error fetching student data:", error);
      }
    }
    fetchStudents();
  }, [data])

  const handleMarksChange = (studentId, value) => {
    setMarksData(prevMarksData => ({
      ...prevMarksData,
      [studentId]: {
        ...prevMarksData[studentId],
        value
      }
    }));
  };

  // const handleEdit = () => {
  //   setMarksData(
  //     data.marks.reduce((acc, mark) => {
  //       acc[mark.student_id._id] = { value: mark.value, present: mark.present };
  //       return acc;
  //     }, {})
  //   );
  // };

  const handleSubmit = async () => {
    try {
      const marksArray = Object.keys(marksData).map(studentId => ({
        student_id: studentId,
        value: marksData[studentId].value,
      }));

      await axios.put(`${process.env.REACT_APP_API_URL}/tests/addMarks/${id}`, { marksData: marksArray });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting marks:", error);
    }
  };

  const handleClearMarks = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/tests/marks/${id}`);
      setMarksData({})
      window.location.reload();
    } catch (error) {
      console.error("Error clearing marks:", error);
    }
  };

  return (
    <div className='view-test-marks'>
        <Navbar />
        <div className="view-test-marks-container">
          <div className="upper-container">
              <div className="test-info-container">
              <div className="mTitle">{data?.name}</div>
              <p><span>Syllabus</span> : {data?.syllabus}</p>
              <p><span>Duration</span> : {data?.duration} min</p>
              <p><span>Marks</span>: {data?.totalMarks}</p> 
              <p><span>Date</span> : {formatDate(data?.date)}</p>
              <p><span>Assigned To</span> : {data?.sclass?.name}</p>
              <p><span>Subject</span>: {data?.subject?.name}</p>
              <p><span>Assigned By</span>: {data?.author?.teachername}</p> 
            </div>
            {data.marks && data.marks.length > 0 && (
              <div className="button-container">
                <button>Edit Marks</button>
                <button onClick={handleClearMarks}>Clear Marks</button>
              </div>
            )}
            
          </div>
          <div className="lower-container">
          {data.marks && data.marks.length > 0 ? (
            <div className="marks-adding-table">
              <div className="marks-row" id='title-row'>
                <div className="marks-col">Enrollment Number</div>
                <div className="marks-col">Student</div>
                <div className="marks-col">Present</div>
                <div className="marks-col">Marks</div>
              </div>
              {data.marks.map((mark, index) => (
                <div className="marks-row" key={index}>
                  <div className="marks-col">{mark.student_id.enroll}</div>
                  <div className="marks-col">{mark.student_id.name}</div>
                  <div className="marks-col">{mark.present ? "Yes" : "No"}</div>
                  <div className="marks-col">{mark.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="marks-adding-table">
              <div className="marks-row" id='title-row'>
                <div className="marks-col">Enrollment Number</div>
                <div className="marks-col">Student</div>
                <div className="marks-col">Marks</div>
              </div>
              {stuData?.students?.map((student, index) => (
                <div className="marks-row" key={index}>
                  <div className="marks-col">{student.enroll}</div>
                  <div className="marks-col">{student.name}</div>
                  <div className="marks-col">
                    <input type="number" name="marks" min="0" max="100"
                      onChange={(e) => handleMarksChange(student._id, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!(data.marks && data.marks.length > 0) && (
            <div className="add-marks-button">
              <button onClick={handleSubmit}>Add Marks</button>
            </div>
          )}
        </div>
        </div>
    </div>
  )
}

export default ViewTestMarks