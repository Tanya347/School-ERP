import "../../utils/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"

import { postURLs } from "../../utils/endpoints/post";
import { createElementWithPicture } from "../../utils/service/usePost";
import { validateCourse } from "../../utils/validators/course";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { coursesConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";

const NewCourse = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentClass, setStudentClass] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const classes = useSelector(state => state.admin.classes);
  
  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateCourse);
  }

  const handleClick = async (e) => {
    const button = document.getElementsByClassName("form-btn")
    button.disabled = "true"
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createElementWithPicture(file, info, "course", postURLs(coursesConst, "normal"));
      if(checkSuccess(res.data.status)) {
        navigate('/admin/courses');
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setFile("");
    setStudentClass("");
    setErrors({});
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
                existingUrl={info?.syllabusPicture}
                label="Syllabus"
              />

            <form>
              <FormInputs 
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />
              <Dropdown
                id="class"
                title="Choose Class"
                options={classes}
                onChange={(e) => {
                  setStudentClass(e.target.value);
                  handleChange(e);
                }}
                value={studentClass}
              />

            </form>
            <div className="submit-button">
              {loading && <Loader text="Creating Course..." />}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleClick} className="form-btn">Create Course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
