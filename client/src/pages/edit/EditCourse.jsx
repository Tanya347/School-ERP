import "../../utils/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { putURLs } from "../../utils/endpoints/put";
import { editElementWithPicture } from "../../utils/service/usePut";
import { courseInputs } from "../../utils/formsource/courseInputs"
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { validateCourse } from "../../utils/validators/course"
import { coursesConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload"

const EditCourse = ({ title }) => {
  
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[4];

  // fetch data using id
  const { data, courseloading } = useFetch(getSingleData(id, coursesConst))

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

    const editInfo = {
      name: info.name,
      subjectCode: info.subjectCode
    }

    try {
      const res = await editElementWithPicture(file, editInfo, "course", putURLs("courses", id));
      if(checkSuccess(res.data.status)) {
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
          <div className="new-container">

          {/* Title of form */}
          <div className="top">
            <h1>{title}</h1>
          </div>

          {/* Form */}
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
                  inputs={courseInputs}
                  values={info}
                  errors={errors}
                  onChange={handleChange}
                />

              </form>

              {/* Submit Button */}
              <div className="submit-button">
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
