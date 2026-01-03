import "../../config/style/profile.scss";

import { useLocation, useNavigate } from "react-router-dom";

import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";

import Course from "../../components/course/Course";
import Loader from "../../components/shared/loader/Loader";

const FacultyProfile = ({ type }) => {

  const location = useLocation();
  const navigate = useNavigate();
  
  let id
  if (type === "Main")
    id = location.pathname.split("/")[3];
  else
    id = location.pathname.split("/")[4];
  const { data, loading } = useFetch(getSingleData(id, "faculties"))


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
            <div className="profile-left">
              <img
                src={data.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
                alt=""
                className="item-img"
              />

              {/* All the details */}
              <div className="details">
                {/* Name */}
                <h1 className="item-title">{data.teachername}</h1>

                {/* ID */}
                <div className="detail-item">
                  <span className="item-key">Registration Number:</span>
                  <span className="item-value">{data.enroll}</span>
                </div>

                {/* Username */}
                <div className="detail-item">
                  <span className="item-key">Username:</span>
                  <span className="item-value">{data.username}</span>
                </div>

                {/* Email */}
                <div className="detail-item">
                  <span className="item-key">Email:</span>
                  <span className="item-value">{data.email}</span>
                </div>

                {/* Phone Number */}
                <div className="detail-item">
                  <span className="item-key">Phone Number:</span>
                  <span className="item-value">{data.facultyPhone}</span>
                </div>

                {/* Address */}
                <div className="detail-item">
                  <span className="item-key">Address:</span>
                  <span className="item-value">{data.facultyAddress}</span>
                </div>

                {/* Joining Year */}
                <div className="detail-item">
                  <span className="item-key">Joining Year:</span>
                  <span className="item-value">{data.joiningYear}</span>
                </div>

                {/* Gender */}
                <div className="detail-item">
                  <span className="item-key">Gender:</span>
                  <span className="item-value">{data.gender}</span>
                </div>

                {/* Date of Birth */}
                <div className="detail-item">
                  <span className="item-key">Date of Birth:</span>
                  <span className="item-value">{data.dob}</span>
                </div>

                <button
                  className="editButton"
                  onClick={() => navigate(`${type === "Admin" ? "/admin" : ""}/faculties/edit/${id}`)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
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
