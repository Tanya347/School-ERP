import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createElementWithPicture } from "../../config/service/usePost";
import { getClasses } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { validateStudent } from "../../config/validators/student";
import { handleChange as commonHandleChange } from "../../config/commons";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";

const NewUser = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateStudent);
  }
  
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call delay
      const res = await createElementWithPicture(file, info, "student", postURLs("student", "register"));
      if(res.data.status === 'success') {
        navigate(`/admin/students/single/${res.data.data.user._id}`);
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
    setErrors({});
    setFile("");
    setGender("");
    setStudentClass("");
  }
  
  return (
    <div className="new">
      <div className="newContainer">
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

              <div className="formInput">
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
                handleChange(e);
                setGender(e.target.value);
              }}
            />

              {inputs?.map((input) => (
                <div className="formInput" key={input.id}>
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

              <Dropdown
                id="class"
                title="Choose Class"
                url={getClasses}
                value={studentClass}
                onChange={(e) => {
                  handleChange(e);
                  setStudentClass(e.target.value);
                }}
              />

            </form>
            <div className="submitButton">
              {loading && <Loader text="Creating student..."/>}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleClick} disabled={loading} className="form-btn">Create Student</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
