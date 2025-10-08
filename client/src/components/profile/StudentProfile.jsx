import React from 'react'
import { useNavigate } from 'react-router-dom';

const StudentProfile = ({data}) => {
  const navigate = useNavigate();
  return (
    <div className='profile-container'>
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

        <button className="editButton" onClick={() => navigate(`/student/edit/${data._id}`)}>Edit Profile</button>
      </div>
    </div>
  )
}

export default StudentProfile