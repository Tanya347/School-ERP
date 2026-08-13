import "../../utils/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import InlineError from "../../components/shared/inlineError/InlineError"

const EditCourse = ({ title }) => {

  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [errors, setErrors] = useState({});
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { courseId } = useParams();
  const navigate = useNavigate();

  const id = courseId;

  // fetch data using id
  const { data, courseloading, error, reFetch } = useFetch(getSingleData(id, coursesConst))

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
    setInfo(data)
  }, [data])

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateCourse);
  }

  const handleDeleteImage = () => {
    setIsImageDeleted(!isImageDeleted);
  }

  // update the data in the data base using put method
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true)

    const editInfo = {
      name: info.name,
      subjectCode: info.subjectCode,
      isImageDeleted
    }

    try {
      const res = await editElementWithPicture(file, editInfo, "course", putURLs("courses", id));
      if(checkSuccess(res?.data?.status)) {
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
      ) : error ? (
        <InlineError
          title="Error loading course data"
          message={error.response?.data?.message || error.message}
          onRetry={reFetch}
        />
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
                onDeleteImage={handleDeleteImage}
                isImageDeleted={isImageDeleted}
              />

              <form>
                
                <FormInputs
                  inputs={courseInputs}
                  values={info}
                  errors={errors}
                  type="edit"
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
