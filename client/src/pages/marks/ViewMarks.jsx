import "./addMarks.scss"

import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getMarksOfSubject } from '../../utils/endpoints/get'
import { getClearMarksSubject } from '../../utils/endpoints/delete'
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { toast } from "react-toastify";
import { checkSuccess } from "../../utils/shared/commons";
import ExportButton from '../../components/shared/excelButton/ExcelButton.jsx';

const ViewMarks = () => {

  const [course, setCourse ]= useState("");
  const [courseName, setCourseName] = useState("");
  const [stuData, setStuData] = useState({});

  const { courseId } = useParams();
  const navigate = useNavigate();

  const courses = useSelector(state => state.faculty.courses);

  // Set course from URL param when courses load
  useEffect(() => {
    if (courseId && courses?.length > 0) {
      const selectedCourse = courses.find(c => c._id === courseId);
      if (selectedCourse) {
        setCourse(selectedCourse._id);
        setCourseName(selectedCourse.subjectCode);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (course) {
        try {
          const response = await axiosInterceptor.get(getMarksOfSubject(course));
          setStuData(response.data.data);
        } catch (error) {
          toast.error(
            <div>
              <strong>Error fetching student data</strong>
              <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
            </div>
          );
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudents();
  }, [course])

  const handleClick = (cl) => {
    navigate(`/faculty/marks/${cl._id}`);
  };

  const handleClear = async() => {
    // this deletes data from the database
    try {
        const res = await axiosInterceptor.delete(getClearMarksSubject(course), { withCredentials: true }
        );

        if (checkSuccess(res.data.status)) {
          toast.success("Marks cleared successfully!");
          setStuData({});
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Failed to clear marks. Please try again.";
        toast.error(errorMessage);
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
            <div className="view-marks-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Course: {courseName}</h1>
              {Object.keys(stuData).length > 0 && (
                <ExportButton
                  data={stuData}
                  filename={`marks_${courseName}`}
                  sheetName="Marks"
                />
              )}
            </div>


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