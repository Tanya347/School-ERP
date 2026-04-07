import "./viewStudents.scss"

import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getCourseStudents } from '../../utils/endpoints/get';
import { studentColumns } from '../../utils/tableSource/studentsColumns';
import axiosInterceptor from "../../utils/shared/axiosInterceptor";

import GenericTable from '../../components/shared/table/Table';
import { toast } from "react-toastify";


const ViewStudents = () => {
  const [course, setCourse] = useState("");
  const [className, setClassName] = useState("");
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
        setClassName(selectedCourse.name);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (course) {
        try {
          const response = await axiosInterceptor.get(getCourseStudents(course));
          setStuData(response.data.data);
        } catch (error) {
          toast.error(
            <div>
              <strong>Error fetching students data</strong>
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
    navigate(`/faculty/class/students/${cl._id}`);
  };
  
  return (
    <div className='view-students'>
      <h1 className='student-title'>Students</h1>
      <div className="view-students-container">
        {courses && courses.length > 0 ? (
          <>
            <div className="classes-button">
              {courses?.map((cr) => (
                <button
                  key={cr._id}
                  onClick={() => handleClick(cr)}
                  className={course === cr._id ? "selected-course" : ""}
                >
                  {cr.subjectCode} {cr.name}
                </button>
              ))}
            </div>
            {course ? 
              (
                <>
                  <h1>Course: {className}</h1>
                </>
              ) : (
                <>
                  <h1>Please select a course</h1>
                </>
              )
            }
            <div className="studentlist-container">
              {course && stuData && <GenericTable columns={studentColumns} rows={stuData} rowKey='id' />}
            </div>
          </>
        ) : (
          <h1>No courses assigned yet</h1>
        )}
      </div>
    </div>
  )
}

export default ViewStudents