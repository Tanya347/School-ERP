import "../../config/style/form.scss";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { createElementWithPicture } from "../../config/service/usePost";
import Loader from "../../components/shared/loader/Loader";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import { validateCourse } from "../../config/validators/course";
import { handleChange as commonHandleChange } from "../../config/commons";

const NewCourse = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentClass, setStudentClass] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateCourse);
  }

  const handleClick = async (e) => {
    const button = document.getElementsByClassName("form-btn")
    button.disabled = "true"
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createElementWithPicture(file, info, "course", postURLs("courses", "normal"));
      if(res.data.status === 'success') {
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

  console.log(info)

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
                (file)
                ? URL.createObjectURL(file)
                : (info.syllabusPicture) ? info.syllabusPicture : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
              }
              alt=""
              />

            <div className="formInput">
                <label htmlFor="file">
                  Syllabus: <DriveFolderUploadIcon className="icon" />
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
              {inputs?.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    className={errors[input.id] ? "error-input" : ""}
                    value={info[input.id] || ""}
                  />
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                </div>
              ))}

              <Dropdown
                id="class"
                title="Choose Class"
                url={getClasses}
                onChange={(e) => {
                  setStudentClass(e.target.value);
                  handleChange(e);
                }}
                value={studentClass}
              />

            </form>
            <div className="submitButton">
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
