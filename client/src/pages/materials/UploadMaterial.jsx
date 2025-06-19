import { useState } from 'react';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import "../../config/style/form.scss";
import Dropdown from '../../components/dropdown/Dropdown';
import { getClasses, getFacultyData } from "../../config/endpoints/get";
import { createElementWithPicture } from '../../config/service/usePost';
import { postURLs } from '../../config/endpoints/post';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { useAuth } from '../../config/context/AuthContext';

const UploadMaterial = ({title, inputs}) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await createElementWithPicture(file, info, "material", postURLs("materials", "normal"));

      if(res.data.status === 'success') {
        navigate(`/${user.role}/materials`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='new'>
      <div className="newContainer">
        <div className="top">
          {title}
        </div>
        <div className="bottom">
          <div className="right">
            <div className="left">
              <div className="formInput">
                <label htmlFor="file">
                  File: <DriveFolderUploadIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".jpg,.png,.jpeg,.pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
                {file && (
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{file.name}</span>
                )}
              </div>
            </div>

            <form>
              <Dropdown
                id="classId"
                title="Choose Class"
                url={user.role === "faculty" ? getFacultyData(user._id, "classes") : getClasses}
                onChange={handleChange}
              />
              {inputs?.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
            </form>
            <div className="submitButton">
            { loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                uploading material...
              </div>}
              <button onClick={handleSubmit} disabled={loading} className="form-btn">Upload Material</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterial;
