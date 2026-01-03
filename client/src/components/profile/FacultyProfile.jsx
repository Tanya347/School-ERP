import './profile.scss'

import { useNavigate } from "react-router-dom";

const FacultyProfile = ({data}) => {

  const navigate = useNavigate();

  return (
    <div className='profile-container'>
      <img
        src={data.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
        alt=""
        className="item-img"
       />
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

        <button className="edit-button" onClick={() => navigate(`/faculty/edit/${data._id}`)}>Edit Profile</button>
      </div>
    </div>
  )
}

export default FacultyProfile