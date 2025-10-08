// import React from 'react'
import './facultyHome.scss'
import SchoolInfo from '../../components/schoolInfo/SchoolInfo'
import { useAuth } from '../../config/context/AuthContext';
import EventCalender from '../../components/calender/Calender';
import Lecture from '../../components/lecture/Lecture';
import useFetch from '../../config/service/useFetch';
import { getSingleData } from '../../config/endpoints/get';
import FacultyProfile from '../../components/profile/FacultyProfile';
import Course from '../../components/course/Course';

const FacultyHome = () => {
  const {user} = useAuth();
  const { data } = useFetch(getSingleData(user._id, "faculties"))

  const colors = ['var(--light-blue)', 'var(--light-pink)', 'var(-light-yellow)', 'var(light-green)', 'var(light-red)']

  const classTeacherClass = data?.classesTaught?.find(
    (cls) => cls._id === data.classTeacherTo
  );

  return (
    <div className='faculty-home-container'>
      <div className="main-container">

        <div className="left-container">
          <SchoolInfo schoolID={user.schoolID} />
          <div className="bottom-container">
            <EventCalender />
            <div className="faculty-courses-container">
              {classTeacherClass && <h3>Class Teacher To: <span>{classTeacherClass.name} Standard</span></h3>}
                <h2 className="cTitle">Classes</h2>
                <div className="classesContainer">
                {data?.classesTaught?.map((item, index) => (
                  <div className="classContainer" key={index} style={{ backgroundColor: colors[index % colors.length]}}>
                    {item.name} Standard
                </div>
              ))}
              </div>
              <h2 className="cTitle">Courses</h2>
              <div className="coursesContainer">
                {data?.subjectsTaught?.map((item, index) => (
                  <Course
                    name={item.name}
                    index={index}
                    subjectCode={item.subjectCode}
                    syllabusPicture={item.syllabusPicture} 
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
        <div className="right-container">
          <FacultyProfile data={data}/>
          <Lecture id={user?._id} type={user?.role}/>
        </div>
      </div>
    </div>
  )
}

export default FacultyHome