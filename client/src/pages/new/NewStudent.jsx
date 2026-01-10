import "../../utils/style/form.scss";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux"

import { createElementWithPicture } from "../../utils/service/usePost";
import { postURLs } from "../../utils/endpoints/post";
import { validateStudent } from "../../utils/validators/student";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { genderTypes } from "../../utils/shared/constants";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";

const NewUser = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  
  const navigate = useNavigate();
  const classes = useSelector(state => state.admin.classes);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateStudent);
  }
  
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await createElementWithPicture(file, info, "student", postURLs("student", "register"));
      if(checkSuccess(res.data.status)) {
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
      <div className="new-container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">

          <div className="form-container">

            <FileUpload
              file={file}
              setFile={setFile}
              label="Profile Picture"
            />
            <form>

            <Dropdown
              id="gender"
              title="Gender"
              options={genderTypes}
              value={gender}
              onChange={(e) => {
                handleChange(e);
                setGender(e.target.value);
              }}
            />
              
              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />

              <Dropdown
                id="classID"
                title="Choose Class"
                options={classes}
                value={studentClass}
                onChange={(e) => {
                  handleChange(e);
                  setStudentClass(e.target.value);
                }}
              />

            </form>
            <div className="submit-button">
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
