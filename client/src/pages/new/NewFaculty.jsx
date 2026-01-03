import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createElementWithPicture } from "../../config/service/usePost";
import { postURLs } from "../../config/endpoints/post";
import { validateFaculty } from "../../config/validators/faculty";
import { handleChange as commonHandleChange } from "../../config/commons";

import Loader from "../../components/shared/loader/Loader";
import Dropdown from "../../components/shared/dropdown/Dropdown";

const NewFaculty = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateFaculty);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createElementWithPicture(file, info, "faculty", postURLs("faculty", "register"));
      if(res.data.status === 'success') {
        navigate(`/admin/faculties/single/${res.data.data.user._id}`);
      }
    }
    catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setFile("");
    setErrors({});
    setGender("");
  }

  return (
    <div className="new">
      <div className="new-container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">

          <div className="right">

          <div className="left">
          <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
              }
              alt=""
            />

              <div className="form-input">
                <label htmlFor="file">
                  Profile Picture: <DriveFolderUploadIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              
          </div>

            <form>

            <Dropdown
              id="gender"
              title="Gender"
              options={[
                { _id: 'Male', name: 'Male' },
                { _id: 'Female', name: 'Female' },
              ]}
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                handleChange(e);
              }}
            />

              {inputs.map((input) => (
                <div className="form-input" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    value={info[input.id] || ""}
                    className={errors[input.id] ? "input-error" : ""}
                  />
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                </div>
              ))}


            </form>
            <div className="submit-button">
              {loading && <Loader text="Creating Faculty..." />}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleClick} className="form-btn">Create Faculty</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFaculty;
