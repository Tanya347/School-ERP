import { profile_url } from "../../../utils/shared/constants";
import Loader from "../loader/Loader";
import "./profileHeader.scss";

const ProfileHeader = ({
  image,
  title,
  fields = [],
  onEdit,
  editLabel = "Edit Profile",
  loading = false,
}) => {
  return (
    <div className="profile-container">
      {loading ? (
        <Loader text="Loading profile information..." type="global" />
      ) : (
        <>
          <img
            src={image || profile_url}
            alt="Profile"
            className="item-img"
          />

          <div className="details">
            <h1 className="item-title">{title}</h1>

            {fields.map(({ label, value }, index) => (
              <div className="detail-item" key={index}>
                <span className="item-key">{label}:</span>
                <span className="item-value">{value ?? "-"}</span>
              </div>
            ))}

            {onEdit && (
              <button className="edit-button" onClick={onEdit}>
                {editLabel}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileHeader;