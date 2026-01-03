import './facultyHome.scss'

import { useSelector } from "react-redux";

import useFetch from '../../config/service/useFetch';
import { getSingleData } from '../../config/endpoints/get';

import EventCalender from '../../components/calender/Calender';
import SchoolInfo from '../../components/schoolInfo/SchoolInfo'
import Lecture from '../../components/lecture/Lecture';
import FacultyProfile from '../../components/profile/FacultyProfile';
import Course from '../../components/course/Course';

const FacultyHome = () => {
  
  const { user } = useSelector(state => state.auth);
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
                <h2 className="c-title">Classes</h2>
                <div className="classes-container">
                {data?.classesTaught?.map((item, index) => (
                  <div className="class-container" key={index} style={{ backgroundColor: colors[index % colors.length]}}>
                    {item.name} Standard
                </div>
              ))}
              </div>
              <h2 className="c-title">Courses</h2>
              <div className="courses-container">
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