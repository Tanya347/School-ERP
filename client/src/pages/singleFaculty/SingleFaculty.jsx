import "./single.scss";

import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Course from "../../components/course/Course";

import useFetch from "../../config/hooks/useFetch";

const Single = ({ type }) => {
  
  // get id of the user using location
  // auth context can also be used 

  const location = useLocation();
  
  let id
  if (type === "Main")
    id = location.pathname.split("/")[2];
  else
    id = location.pathname.split("/")[3];
  const { data } = useFetch(`/faculties/${id}`)

  const colors = ['var(--light-blue)', 'var(--light-pink)', 'var(-light-yellow)', 'var(light-green)', 'var(light-red)']

  // used to navigate to a certain link
  const navigate = useNavigate();

  return (
    <div className="facultyProfile">

        {(type === "Admin") ? (<AdminNavbar />) : (<Navbar />)}
        
        <div className="top">
          <div className="left">
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

                {/* Courses */}
                <div className="detailItem">
                  <span className="itemKey">Course:</span>
                  {/* <span className="itemValue">{data.subject.name}</span> */}
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

                <button className="editButton" onClick={() => navigate("edit")}>Edit Profile</button>

              </div>
          </div>
          <div className="right">
            <h2 className="cTitle">Classes</h2>
            <div className="classesContainer">
              {data?.classesTaught?.map((item, index) => (
                <div className="classContainer" key={index} style={{ backgroundColor: colors[index % colors.length]}}>
                  {item.name} Standard
                </div>
              ))}
            </div>
            <h2 className="cTitle">Courses</h2>
            <div className="coursesContainer">
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

        <div className="bottom">

        </div>

    </div>
  );
};

export default Single;
