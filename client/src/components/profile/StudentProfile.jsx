import { useNavigate } from 'react-router-dom';
import { profile_url } from '../../config/utils/constants';

const StudentProfile = ({data}) => {

  const navigate = useNavigate();
  
  return (
    <div className='profile-container'>
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

        <button className="edit-button" onClick={() => navigate(`/student/edit/${data._id}`)}>Edit Profile</button>
      </div>
    </div>
  )
}

export default StudentProfile