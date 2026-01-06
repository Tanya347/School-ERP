import "./addMarks.scss"

import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

import { getMarksOfSubject } from '../../config/endpoints/get'
import { getClearMarksSubject } from '../../config/endpoints/delete'
import axiosInterceptor from "../../config/utils/axiosInterceptor";

const ViewMarks = () => {

  const [course, setCourse ]= useState("");
  const [courseName, setCourseName] = useState("");
  const [stuData, setStuData] = useState({});

  const courses = useSelector(state => state.faculty.courses);

  useEffect(() => {
    const fetchStudents = async () => {
      if (course) {
        try {
          const response = await axiosInterceptor.get(getMarksOfSubject);
          setStuData(response.data.data);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudents();
  }, [course])

  const handleClick = (cl) => {
    setCourse(cl._id);
    setCourseName(cl.subjectCode);
  };

  const handleClear = async() => {
    // this deletes data from the database
    try {
        await axiosInterceptor.delete(getClearMarksSubject(course), { withCredentials: true }
        );
  
        // this filters the array by filtering out the deleted element based on the id
        setStuData({});
      } catch (err) {
        console.log(err)
      }
  }

  return (
    <div className='add-marks'>
      <div className="add-marks-container">
        <div className="classes-button">
          {
            courses?.map((cl, index) => (
              <button
                key={index}
                onClick={() => handleClick(cl)}
                className={course === cl._id ? "selected-course" : ""}
              >{cl.subjectCode}</button>
            ))
          }
        </div>
        {course ? (
          <>
            <h1>Course: {courseName}</h1>

          
              {Object.keys(stuData).length ? 
                (
                  <>
                  <div className="marks-adding-table">
                    <div className="marks-row" id='title-row'>
                      <div className="marks-col">Enrollment Number</div>
                      <div className="marks-col">Student</div>
                      <div className="marks-col">Marks</div>
                    </div>
                  {stuData?.map((st, index) => (
                    <div className="marks-row" key={index}>
                      <div className="marks-col">{st.enrollment}</div>
                      <div className="marks-col">{st.studentName}</div>
                      <div className="marks-col">{st.marks}</div>
                    </div>
                  ))}
                  </div>
                  </>
                ) : (
                  <>
                    <h1>No marks entered yet</h1>
                  </>
                )
              }

            {Object.keys(stuData).length !== 0 && <div className="clear-marks-button">
              <button onClick={handleClear}>Clear Marks</button>
            </div>}
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

export default ViewMarks