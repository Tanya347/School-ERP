import "./profile.scss";
import 'react-circular-progressbar/dist/styles.css';

import { useParams, useNavigate } from "react-router-dom";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";

import { studentsConst } from "../../utils/shared/constants";
import { studentProfileFields } from "../../utils/shared/profileFieldConfigs";

import Course from "../../components/course/Course";
import Loader from "../../components/shared/loader/Loader";
import InlineError from "../../components/shared/inlineError/InlineError";
import ProfileHeader from "../../components/shared/profileHeader/ProfileHeader";
import StudentMarksHistory from "../../components/studentMarksHistory/StudentMarksHistory";

const StudentProfile = ({ type }) => {

  const { id: mainId, studentId } = useParams();
  const navigate = useNavigate();

  const id = mainId || studentId;

  const { data, loading, error, reFetch } = useFetch(getSingleData(id, studentsConst));

  return (
    <div className="single-profile-container student-profile">
      {loading ? (
        <Loader text="Loading data..." type="global" />
      ) : error ? (
        <InlineError
          title="Error loading profile"
          message={error.response?.data?.message || error.message}
          onRetry={reFetch}
        />
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
              <StudentMarksHistory studentId={id} />
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
