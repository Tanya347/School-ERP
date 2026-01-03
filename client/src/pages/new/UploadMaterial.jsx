import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

import { getClasses, getFacultyData } from "../../config/endpoints/get";
import { createElementWithPicture } from '../../config/service/usePost';
import { postURLs } from '../../config/endpoints/post';
import { handleChange as commonHandleChange } from "../../config/commons";
import { validateMaterial } from '../../config/validators/material';

import Dropdown from '../../components/shared/dropdown/Dropdown';

const UploadMaterial = ({title, inputs}) => {

  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sclass, setSclass] = useState("");

  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateMaterial);
  }

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

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setFile("");
    setErrors({});
    setSclass("");
  }

  return (
    <div className='new'>
      <div className="new-container">
        <div className="top">
          {title}
        </div>
        <div className="bottom">
          <div className="right">
            <div className="left">
              <div className="form-input">
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
                onChange={(e) => {
                  handleChange(e);
                  setSclass(e.target.value);
                }}
                value={sclass}
              />
              {inputs?.map((input) => (
                <div className="form-input" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    value={info[input.id] || ""}
                    className={errors[input.id] ? "error-input" : ""}
                  />
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                </div>
              ))}
            </form>
            <div className="submit-button">
            { loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                uploading material...
              </div>}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleSubmit} disabled={loading} className="form-btn">Upload Material</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterial;
