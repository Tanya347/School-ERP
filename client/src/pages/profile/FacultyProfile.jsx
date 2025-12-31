import "../../config/style/profile.scss";

import { useLocation, useNavigate } from "react-router-dom";
import Course from "../../components/course/Course";

import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import Loader from "../../components/loader/Loader";

const FacultyProfile = ({ type }) => {

  const location = useLocation();
  
  let id
  if (type === "Main")
    id = location.pathname.split("/")[3];
  else
    id = location.pathname.split("/")[4];
  const { data, loading } = useFetch(getSingleData(id, "faculties"))

  const lightColors = [
    'var(--light-blue)',
    'var(--light-pink)',
    'var(--light-yellow)',
    'var(--light-green)',
    'var(--light-red)'
  ];

  const darkColors = [
    'var(--dark-blue)',
    'var(--dark-purple)',
    'var(--golden)',
    'var(--tree-green)',
    'var(--deep-red)'
  ];
  // used to navigate to a certain link
  const navigate = useNavigate();

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
                className="itemImg"
              />

              {/* All the details */}
              <div className="details">
                {/* Name */}
                <h1 className="itemTitle">{data.teachername}</h1>

                {/* ID */}
                <div className="detailItem">
                  <span className="itemKey">Registration Number:</span>
                  <span className="itemValue">{data.enroll}</span>
                </div>

                {/* Username */}
                <div className="detailItem">
                  <span className="itemKey">Username:</span>
                  <span className="itemValue">{data.username}</span>
                </div>

                {/* Email */}
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data.email}</span>
                </div>

                {/* Phone Number */}
                <div className="detailItem">
                  <span className="itemKey">Phone Number:</span>
                  <span className="itemValue">{data.facultyPhone}</span>
                </div>

                {/* Address */}
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{data.facultyAddress}</span>
                </div>

                {/* Joining Year */}
                <div className="detailItem">
                  <span className="itemKey">Joining Year:</span>
                  <span className="itemValue">{data.joiningYear}</span>
                </div>

                {/* Gender */}
                <div className="detailItem">
                  <span className="itemKey">Gender:</span>
                  <span className="itemValue">{data.gender}</span>
                </div>

                {/* Date of Birth */}
                <div className="detailItem">
                  <span className="itemKey">Date of Birth:</span>
                  <span className="itemValue">{data.dob}</span>
                </div>

                <button
                  className="editButton"
                  onClick={() => navigate(`/faculties/edit/${id}`)}
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
                <div className="fclassesContainer">
                  <h2 className="fclassTitle">Classes</h2>
                  {data?.classesTaught?.length === 0 ? (
                    <span style={{"fontWeight": "normal"}}>No classes assigned yet.</span>
                  ) : (
                    data?.classesTaught?.map((item, index) => (
                      <div className="classContainer" key={index}>
                        {item.name} Standard
                      </div>
                    ))
                  )}
                </div>
                <div className="fcoursesContainer">
                  <h2 className="fcourseTitle">Courses</h2>
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
