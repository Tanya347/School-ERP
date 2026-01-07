import "./profile.scss";

import { useLocation, useNavigate } from "react-router-dom";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";

import Course from "../../components/course/Course";
import Loader from "../../components/shared/loader/Loader";
import { facultiesConst } from "../../utils/shared/constants";
import ProfileHeader from "../../components/shared/profileHeader/ProfileHeader";
import { facultyProfileFields } from "../../utils/shared/profileFieldConfigs";

const FacultyProfile = ({ type }) => {

  const location = useLocation();
  const navigate = useNavigate();
  
  let id
  if (type === "Main")
    id = location.pathname.split("/")[3];
  else
    id = location.pathname.split("/")[4];
  const { data, loading } = useFetch(getSingleData(id, facultiesConst))


  // Find the class object where _id matches classTeacherTo
  const classTeacherClass = data?.classesTaught?.find(
    (cls) => cls._id === data.classTeacherTo
  );

  return (
    <div className="single-profile-container faculty-profile">
      {loading ? (
        <Loader text="Loading data..." type="global" />
      ) : (
        <>
          <div className="profile-top">
            
            <ProfileHeader
              image={data.profilePicture}
              title={data.teachername}
              fields={facultyProfileFields(data)}
              onEdit={() =>
                navigate(`${type === "Admin" ? "/admin" : ""}/faculties/edit/${id}`)
              }
            />

            <div className="profile-right">
              {classTeacherClass && (
                <h3>
                  Class Teacher To: <span>{classTeacherClass.name} Standard</span>
                </h3>
              )}
              <div className="class-course-container">
                <div className="f-classes-container">
                  <h2 className="f-class-title">Classes</h2>
                  {data?.classesTaught?.length === 0 ? (
                    <span style={{"fontWeight": "normal"}}>No classes assigned yet.</span>
                  ) : (
                    data?.classesTaught?.map((item, index) => (
                      <div className="class-container" key={index}>
                        {item.name} Standard
                      </div>
                    ))
                  )}
                </div>
                <div className="f-courses-container">
                  <h2 className="f-course-title">Courses</h2>
                  <div className="courses-wrapper">
                    {(data?.subjectsTaught === null ||
                      data?.subjectsTaught?.length === 0) ? (
                      <span style={{"fontWeight": "normal"}}>No courses assigned yet.</span>
                    ) : (
                      <>
                        {data?.subjectsTaught?.map((item, index) => (
                          <Course
                            key={item.subjectCode || index}
                            name={item.name}
                            index={index}
                            subjectCode={item.subjectCode}
                            syllabusPicture={item.syllabusPicture}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-bottom"></div>
        </>
      )}
    </div>
  );
};

export default FacultyProfile;
