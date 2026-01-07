import './facultyHome.scss'

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useFetch from '../../utils/service/useFetch';
import { getSingleData } from '../../utils/endpoints/get';
import { facultiesConst, FACULTY_HOME_COLORS } from '../../utils/shared/constants';
import { facultyProfileFields } from '../../utils/shared/profileFieldConfigs';

import EventCalender from '../../components/calender/Calender';
import SchoolInfo from '../../components/schoolInfo/SchoolInfo'
import Lecture from '../../components/lecture/Lecture';
import Course from '../../components/course/Course';
import ProfileHeader from '../../components/shared/profileHeader/ProfileHeader';

const FacultyHome = () => {
  
  const { user } = useSelector(state => state.auth);
  const { data } = useFetch(getSingleData(user._id, facultiesConst))

  const navigate = useNavigate();

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
                  <div className="class-container" key={index} style={{ backgroundColor: FACULTY_HOME_COLORS[index % FACULTY_HOME_COLORS.length]}}>
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
          {/* <div className="profile-container"> */}
            <ProfileHeader
              image={data?.profilePicture}
              title={data?.teachername}
              fields={facultyProfileFields(data || {})}
              onEdit={() => navigate(`/faculty/edit/${data?._id}`)}
            />
          {/* </div> */}
          <Lecture id={user?._id} type={user?.role}/>
        </div>
      </div>
    </div>
  )
}

export default FacultyHome