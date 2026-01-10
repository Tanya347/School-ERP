import './facultyHome.scss'

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useFetch from '../../utils/service/useFetch';
import { getSingleData } from '../../utils/endpoints/get';
import { facultiesConst } from '../../utils/shared/constants';
import { facultyProfileFields } from '../../utils/shared/profileFieldConfigs';

import EventCalender from '../../components/calender/Calender';
import SchoolInfo from '../../components/schoolInfo/SchoolInfo'
import Lecture from '../../components/lecture/Lecture';
import Course from '../../components/course/Course';
import ProfileHeader from '../../components/shared/profileHeader/ProfileHeader';
import Loader from '../../components/shared/loader/Loader';

const FacultyHome = () => {
  
  const { user } = useSelector(state => state.auth);
  const { data, loading } = useFetch(getSingleData(user._id, facultiesConst))

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
             {loading ? (<Loader text="Loading courses information..." type="global"/>) : (<>{classTeacherClass && <h3>Class Teacher To: <span>{data?.faculty?.classTeacherTo?.name} Standard</span></h3>}
              <h2 className="c-title">Courses</h2>
              <div className="courses-container">
                {data?.courses?.length > 0 ? (
                  data?.courses?.map((item, index) => (
                    <Course
                      name={item.name}
                      index={index}
                      subjectCode={item.subjectCode}
                      syllabusPicture={item.syllabusPicture} 
                      examStatus={item?.examStatus?.status}
                      className={item?.classID?.name}
                    />
                  ))
                ) : (
                  <p>No courses available</p>
                )}
              </div></>)}
            </div>

          </div>
        </div>
        <div className="right-container">
          {/* <div className="profile-container"> */}
            <ProfileHeader
              image={data?.faculty?.profilePicture}
              title={data?.faculty?.teachername}
              fields={facultyProfileFields(data?.faculty || {})}
              loading={loading}
              onEdit={() => navigate(`/faculty/edit/${data?.faculty?._id}`)}
            />
          {/* </div> */}
          <Lecture id={user?._id} type={user?.role}/>
        </div>
      </div>
    </div>
  )
}

export default FacultyHome