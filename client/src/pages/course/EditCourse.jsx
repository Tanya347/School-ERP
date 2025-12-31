import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { editElementWithPicture } from "../../config/service/usePut";
import { courseInputs } from "../../config/formsource/courseInputs"
import { handleChange as commonHandleChange } from "../../config/commons";
import { validateCourse } from "../../config/validators/course"
import Loader from "../../components/loader/Loader";

const EditCourse = ({ title }) => {
  
  // get location and extract id out of it
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [errors, setErrors] = useState({});

  // fetch data using id
  const { data, courseloading } = useFetch(getSingleData(id, "courses"))

  const navigate = useNavigate();

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
    setInfo(data)
  }, [data])

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateCourse);
  }

  // update the data in the data base using put method
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await editElementWithPicture(file, info, "course", putURLs("courses", id));
      if(res.data.status === 'success') {
        navigate('/admin/courses');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="new">

      {courseloading ? (
        <Loader text="Loading data..." type="global" />
      ) : (
        <>
          <div className="newContainer">

          {/* Title of form */}
          <div className="top">
            <h1>{title}</h1>
          </div>

          {/* Form */}
          <div className="bottom">
            <div className="right">
            <div className="left">
              <img
                src={
                  (file)
                    ? URL.createObjectURL(file)
                    : (info.profilePicture) ? info.profilePicture : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
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
                
                {courseInputs?.map((field) => (
                  <div className="formInput">
                    <label>{field.label}</label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      value={info[field.id] || ""}
                      className={errors[field.id] ? "error-input" : ""}
                    />
                    {errors[field.id] && <span className="error-message">{errors[field.id]}</span>}
                  </div>
                ))}

              </form>

              {/* Submit Button */}
              <div className="submitButton">
                {loading && <Loader text="Editing Course..." />}
                <button onClick={handleClick} id="submit" className="form-btn">Edit Course</button>
              </div>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default EditCourse;
