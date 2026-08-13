import "./viewStudents.scss"

import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getCourseStudents } from '../../utils/endpoints/get';
import { studentColumns } from '../../utils/tableSource/studentsColumns';
import useFetch from "../../utils/service/useFetch";

import GenericTable from '../../components/shared/table/Table';
import InlineError from '../../components/shared/inlineError/InlineError';

const ViewStudents = () => {
  const [course, setCourse] = useState("");
  const [className, setClassName] = useState("");

  const { courseId } = useParams();
  const navigate = useNavigate();

  const courses = useSelector(state => state.faculty.courses);

  // Fetch students using the improved useFetch hook
  const { data: stuData, loading, error, reFetch } = useFetch(
    course ? getCourseStudents(course) : null,
    { enabled: !!course }
  );

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
              {loading ? (
                <div className="inline-loader">Loading students...</div>
              ) : error ? (
                <InlineError
                  title="Error fetching students data"
                  message={error.response?.data?.message || error.message || 'An unknown error occurred'}
                  onRetry={reFetch}
                />
              ) : (
                course && stuData && <GenericTable columns={studentColumns} rows={stuData} rowKey='id' />
              )}
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