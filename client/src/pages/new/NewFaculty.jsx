import "../../utils/style/form.scss";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createElementWithPicture } from "../../utils/service/usePost";
import { postURLs } from "../../utils/endpoints/post";
import { validateFaculty } from "../../utils/validators/faculty";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { genderTypes } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";

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
      if(checkSuccess(res.data.status)) {
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
                setGender(e.target.value);
                handleChange(e);
              }}
            />

            <FormInputs 
              inputs={inputs}
              values={info}
              errors={errors}
              onChange={handleChange}
            />

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
