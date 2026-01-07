import "./profile.scss";
import 'react-circular-progressbar/dist/styles.css';

import { useLocation, useNavigate } from "react-router-dom";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";

import { studentsConst } from "../../utils/shared/constants";
import { studentProfileFields } from "../../utils/shared/profileFieldConfigs";

import Course from "../../components/course/Course";
import Loader from "../../components/shared/loader/Loader";
import ProfileHeader from "../../components/shared/profileHeader/ProfileHeader";

const StudentProfile = ({ type }) => {
  
  const location = useLocation();
  const navigate = useNavigate();

  let id;
  if (type === "Main")
    id = location.pathname.split("/")[3];
  else
    id = location.pathname.split("/")[4];

  const { data, loading } = useFetch(getSingleData(id, studentsConst));

  return (
    <div className="single-profile-container student-profile">
      {loading ? (
        <Loader text="Loading data..." type="global" />
      ) : (
        <>
          <div className="profile-top">
            
            <ProfileHeader
              image={data.profilePicture}
              title={data.name}
              fields={studentProfileFields(data)}
              onEdit={() =>
                navigate(`${type === "Admin" ? "/admin" : ""}/students/edit/${id}`)
              }
            />

            <div className="profile-right">
              Future scope: show attendance chart, marks history etc.
            </div>
          </div>
          <div className="profile-bottom">
            <h2 className="course-title">Courses</h2>
            <div className="courses-container">
              {data?.classInfo == null || data?.classInfo?.subjects?.length === 0 ? (
                <span>No courses assigned yet.</span>
              ) : (
                <>
                  {data?.classInfo?.subjects?.map((item, index) => (
                    <Course
                      key={item?.subjectCode || index}
                      name={item?.name}
                      index={index}
                      subjectCode={item?.subjectCode}
                      syllabusPicture={item?.syllabusPicture}
                      teacher={item?.teacher?.teachername}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentProfile;
