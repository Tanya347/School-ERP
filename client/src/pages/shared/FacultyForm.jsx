import "../../utils/style/form.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { postURLs } from "../../utils/endpoints/post";
import { putURLs } from "../../utils/endpoints/put";
import { createElementWithPicture } from "../../utils/service/usePost";
import { editElementWithPicture } from "../../utils/service/usePut";
import { validateFaculty } from "../../utils/validators/faculty";
import { facultiesConst, genderTypes } from "../../utils/shared/constants";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import InlineError from "../../components/shared/inlineError/InlineError";

const FacultyForm = ({ mode, inputs, title }) => {
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gender, setGender] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { id: mainId, facultyId } = useParams();
  const id = mainId || facultyId;
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // For Edit mode: fetch data
  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, facultiesConst) : null
  );

  useEffect(() => {
    if (mode === "edit" && data) {
      setInfo(data.faculty || data);
      setGender(data.faculty?.gender || data.gender || "");
    }
  }, [data, mode]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateFaculty);
  };

  const handleDeleteImage = () => {
    setIsImageDeleted(!isImageDeleted);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const res = await createElementWithPicture(file, info, "faculty", postURLs("faculty", "register"));
        if (checkSuccess(res.data.status)) {
          navigate(`/admin/faculties/single/${res.data.data.user._id}`);
        }
      } else {
        const newInfo = {
          ...info,
          isImageDeleted,
        };
        const res = await editElementWithPicture(file, newInfo, "faculty", putURLs(facultiesConst, id));
        if (checkSuccess(res.data.status)) {
          navigate(`/admin/faculties/single/${id}`);
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
    setGender("");
    setIsImageDeleted(false);
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading faculty data"
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
              existingUrl={mode === "edit" ? info.profilePicture : ""}
              label="Profile Picture"
              onDeleteImage={mode === "edit" ? handleDeleteImage : null}
              isImageDeleted={mode === "edit" ? isImageDeleted : false}
            />
            <form>
              <Dropdown
                id="gender"
                title="Gender"
                options={genderTypes}
                value={mode === "edit" ? info.gender : gender}
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
                role={user?.role}
                type={mode === "edit" ? "edit" : "create"}
              />
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "Creating Faculty..." : "Editing faculty..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button
                onClick={handleClick}
                disabled={loading}
                className="form-btn"
              >
                {mode === "create" ? "Create Faculty" : "Edit Faculty"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;
