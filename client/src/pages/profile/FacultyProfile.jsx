import "./profile.scss";

import { useParams, useNavigate } from "react-router-dom";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";

import Course from "../../components/course/Course";
import Loader from "../../components/shared/loader/Loader";
import { facultiesConst } from "../../utils/shared/constants";
import ProfileHeader from "../../components/shared/profileHeader/ProfileHeader";
import InlineError from "../../components/shared/inlineError/InlineError";

import { facultyProfileFields } from "../../utils/shared/profileFieldConfigs";

const FacultyProfile = ({ type }) => {

  const { id: mainId, facultyId } = useParams();
  const navigate = useNavigate();

  const id = mainId || facultyId;
  const { data, loading, error, reFetch } = useFetch(getSingleData(id, facultiesConst))

  return (
    <div className="single-profile-container faculty-profile">
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
              image={data?.faculty?.profilePicture}
              title={data?.faculty?.teachername}
              fields={facultyProfileFields(data?.faculty)}
              onEdit={() =>
                navigate(`${type === "Admin" ? "/admin" : ""}/faculties/edit/${id}`)
              }
            />

            <div className="profile-right">
              {data?.faculty?.classTeacherTo && (
                <h3>
                  Class Teacher To: <span>{data?.faculty?.classTeacherTo?.name} Standard</span>
                </h3>
              )}
              <div className="class-course-container">
                <div className="f-courses-container">
                  <h2 className="f-course-title">Courses</h2>
                  <div className="courses-wrapper">
                    {data?.courses?.length === 0 ? (
                      <span style={{ fontWeight: "normal" }}>
                        No courses assigned yet.
                      </span>
                    ) : (
                      data?.courses?.map((item) => (
                        <Course
                          key={item._id}
                          name={item.name}
                          subjectCode={item.subjectCode}
                          syllabusPicture={item.syllabusPicture}
                          className={item.classID?.name}   // 👈 extra useful info
                          examStatus={item.examStatus?.status}
                        />
                      ))
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
