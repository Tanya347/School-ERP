import "../../utils/style/form.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { postURLs } from "../../utils/endpoints/post";
import { putURLs } from "../../utils/endpoints/put";
import { createElementWithPicture } from "../../utils/service/postHelper";
import { editElementWithPicture } from "../../utils/service/putHelper";
import { validateCourse } from "../../utils/validators/course";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { coursesConst } from "../../utils/shared/constants";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import InlineError from "../../components/shared/inlineError/InlineError";

const CourseForm = ({ mode, inputs, title }) => {
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [studentClass, setStudentClass] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { id: mainId, courseId } = useParams();
  const id = mainId || courseId;
  const navigate = useNavigate();
  const classes = useSelector(state => state.admin.classes);

  // For Edit mode: fetch data
  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, coursesConst) : null
  );

  useEffect(() => {
    if (mode === "edit" && data) {
      setInfo(data);
      setStudentClass(data.classID?._id || "");
    }
  }, [data, mode]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateCourse);
  };

  const handleDeleteImage = () => {
    setIsImageDeleted(!isImageDeleted);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const res = await createElementWithPicture(file, info, "course", postURLs(coursesConst, "normal"));
        if (checkSuccess(res.data.status)) {
          navigate('/admin/courses');
        }
      } else {
        const newInfo = {
          ...info,
          classID: studentClass || info.classID?._id,
          isImageDeleted,
        };
        const res = await editElementWithPicture(file, newInfo, "course", putURLs("courses", id));
        if (checkSuccess(res.data.status)) {
          navigate('/admin/courses');
        }
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
    setErrors({});
    setFile("");
    setStudentClass("");
    setIsImageDeleted(false);
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading course data"
        message={error.response?.data?.message || error.message}
        onRetry={reFetch}
      />
    );
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
              existingUrl={mode === "edit" ? info.syllabusPicture : ""}
              label="Syllabus"
              onDeleteImage={mode === "edit" ? handleDeleteImage : null}
              isImageDeleted={mode === "edit" ? isImageDeleted : false}
            />
            <form>
              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
                type={mode === "edit" ? "edit" : "create"}
              />
              <Dropdown
                id="classID"
                title="Choose Class"
                options={classes}
                value={mode === "edit" ? (studentClass || info.classID?._id || "") : studentClass}
                onChange={(e) => {
                  handleChange(e);
                  setStudentClass(e.target.value);
                }}
              />
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "Creating Course..." : "Editing Course..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button
                onClick={handleClick}
                disabled={loading}
                className="form-btn"
              >
                {mode === "create" ? "Create Course" : "Edit Course"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
