import "../../config/style/profile.scss";
import 'react-circular-progressbar/dist/styles.css';

import { useLocation, useNavigate } from "react-router-dom";

import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";

import Course from "../../components/course/Course";
import Loader from "../../components/shared/loader/Loader";
import { profile_url, studentsConst } from "../../config/utils/constants";

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
            <div className="profile-left">
              <img
                src={data.profilePicture || profile_url}
                alt=""
                className="item-img"
              />

              <div className="details">
                {/* Name */}
                <h1 className="item-title">{data.name}</h1>

                {/* ID */}
                <div className="detail-item">
                  <span className="item-key">Enrollment Number:</span>
                  <span className="item-value">{data?.enroll}</span>
                </div>

                {/* Username */}
                <div className="detail-item">
                  <span className="item-key">Username:</span>
                  <span className="item-value">{data?.username}</span>
                </div>

                {/* Email */}
                <div className="detail-item">
                  <span className="item-key">Email:</span>
                  <span className="item-value">{data?.email}</span>
                </div>

                {/* Phone Number */}
                <div className="detail-item">
                  <span className="item-key">Phone Number:</span>
                  <span className="item-value">{data?.studentPhone}</span>
                </div>

                {/* Address */}
                <div className="detail-item">
                  <span className="item-key">Address:</span>
                  <span className="item-value">{data?.studentAddress}</span>
                </div>

                {/* Department */}
                <div className="detail-item">
                  <span className="item-key">Class:</span>
                  <span className="item-value">{data?.classname}</span>
                </div>

                {/* Gender */}
                <div className="detail-item">
                  <span className="item-key">Gender:</span>
                  <span className="item-value">{data?.gender}</span>
                </div>

                {/* Date of Birth */}
                <div className="detail-item">
                  <span className="item-key">Date of Birth:</span>
                  <span className="item-value">{data?.dob}</span>
                </div>

                <button
                  className="edit-button"
                  onClick={() =>
                    navigate(
                      `${type === "Admin" ? "/admin" : ""}/students/edit/${id}`
                    )
                  }
                >
                  Edit Profile
                </button>
              </div>
            </div>
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
