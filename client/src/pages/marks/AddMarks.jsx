import React, { useEffect, useState } from 'react'
import "./addMarks.scss"

import { useAuth } from '../../config/context/AuthContext'
import useFetch from '../../config/service/useFetch'
import { getFacultyData } from '../../config/endpoints/get'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import axios from 'axios'
import { addMarks } from '../../config/endpoints/put'


const AddMarks = () => {

  const { user } = useAuth();
  const courses = useFetch(getFacultyData(user._id, "courses")).data
  const [course, setCourse ]= useState("");
  const [marksAdded, setMarksAdded] = useState(false);
  const [sclass, setSclass] = useState("");
  const [courseName, setCourseName] = useState("");
  const [stuData, setStuData] = useState({});
  const [marksData, setMarksData] = useState({});


  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      if (sclass) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/students/${sclass}`);
          setStuData(response.data);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudents();
  }, [sclass])

  const handleClick = (cl) => {
    setCourse(cl._id);
    setCourseName(cl.subjectCode);
    setSclass(cl.sclass)
    setMarksAdded(cl.marksAdded)
  };
  
  const handleMarksChange = (studentId, marks) => {
    setMarksData((prevMarksData) => ({
      ...prevMarksData,
      [studentId]: marks,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedMarksData = Object.entries(marksData).map(([studentId, marks]) => ({
        studentId,
        marks,
      }));

      await axios.put(addMarks(course), {
        marksData: formattedMarksData,
      });

      navigate('/faculty/marks');
    } catch (error) {
      console.error('Error adding marks:', error);
    }
  };

  console.log(marksAdded)

  return (
    <div className='add-marks'>
      <Navbar />
      <div className="add-marks-container">
        <div className="classes-button">
          {
            courses?.map((cl, index) => (
              <button key={index} onClick={() => handleClick(cl)}>{cl.subjectCode}</button>
            ))
          }
        </div>
        {course ? (
          <>
            <h1>Course: {courseName}</h1>

            {marksAdded ? 
              (
                <>
                  <h1>Marks already added for this course</h1>
                </>
              ) : (
                <>
                  <div className="marks-adding-table">
              <div className="marks-row" id='title-row'>
                <div className="marks-col">Enrollment Number</div>
                <div className="marks-col">Student</div>
                <div className="marks-col">Marks</div>
              </div>
          
              {stuData?.students?.map((st, index) => (
                <div className="marks-row" key={index}>
                  <div className="marks-col">{st.enroll}</div>
                  <div className="marks-col">{st.name}</div>
                  <div className="marks-col">
                    <input type="number" name="marks" id="marks" min="0" max="100"
                      onChange={(e) => handleMarksChange(st._id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="add-marks-button">
              <button onClick={handleSubmit}>Add Marks</button>
            </div>
                </>
              )
            }
          </>
        ) : (
          <>
            <h1>Please select a course</h1>
          </>
        )}
      </div>
    </div>
  )
}

export default AddMarks