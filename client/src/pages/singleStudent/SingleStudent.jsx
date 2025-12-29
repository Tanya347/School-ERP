import "./single.scss";

import { useLocation, useNavigate} from "react-router-dom";
import useFetch from "../../config/service/useFetch";
import Course from "../../components/course/Course";
import { getSingleData } from "../../config/endpoints/get";
import 'react-circular-progressbar/dist/styles.css';
import Loader from "../../components/loader/Loader";


const Single = ({ type }) => {

  const location = useLocation();
  
  let id
  if (type === "Main")
    id = location.pathname.split("/")[3];
  else
    id = location.pathname.split("/")[4];
  const { data, loading } = useFetch(getSingleData(id, "students"))

  // used to navigate to a certain link
  const navigate = useNavigate();

  return (
    <div className="studentProfile">
      {loading ? (
        <Loader text="Loading data..." />
      ) : (<>
        
      <div className="top">
          <div className="left">
            <img
              src={data.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
              alt=""
              className="itemImg"
            />

            <div className="details">
              {/* Name */}
              <h1 className="itemTitle">{data.name}</h1>
                
                {/* ID */}
                <div className="detailItem">
                  <span className="itemKey">Enrollment Number:</span>
                  <span className="itemValue">{data?.enroll}</span>
                </div>
                
                {/* Username */}
                <div className="detailItem">
                  <span className="itemKey">Username:</span>
                  <span className="itemValue">{data?.username}</span>
                </div>
                
                {/* Email */}
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data?.email}</span>
                </div>
                
                {/* Phone Number */}
                <div className="detailItem">
                  <span className="itemKey">Phone Number:</span>
                  <span className="itemValue">{data?.studentPhone}</span>
                </div>

                {/* Address */}
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{data?.studentAddress}</span>
                </div>
                
                {/* Department */}
                <div className="detailItem">
                  <span className="itemKey">Class:</span>
                  <span className="itemValue">{data?.classname}</span>
                </div>

                {/* Gender */}
                <div className="detailItem">
                  <span className="itemKey">Gender:</span>
                  <span className="itemValue">{data?.gender}</span>
                </div>

                {/* Date of Birth */}
                <div className="detailItem">
                  <span className="itemKey">Date of Birth:</span>
                  <span className="itemValue">{data?.dob}</span>
                </div>

                <button className="editButton" onClick={() => navigate(`${type === "Admin" ? "/admin" : ""}/student/edit/${id}`)}>Edit Profile</button>
            </div>
          </div>
          <div className="right">
            Future scope: show attendance chart, marks history etc.
          </div>
        </div>
        <div className="bottom">
          <h2 className="courseTitle">Courses</h2>
          <div className="coursesContainer">
            {data?.classInfo?.subjects?.map((item, index) => (
              <Course 
                name={item?.name}
                index={index}
                subjectCode={item?.subjectCode}
                syllabusPicture={item?.syllabusPicture} 
                teacher={item?.teacher?.teachername}
              />
            ))}
          </div>
        </div>
      </>)}
        
    </div>
  );
};

export default Single;
