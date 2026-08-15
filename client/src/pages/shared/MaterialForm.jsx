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
import { validateMaterial } from "../../utils/validators/material";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { materialsConst } from "../../utils/shared/constants";
import { selectAvailableClasses } from "../../utils/store/selectors/classSelectors";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import InlineError from "../../components/shared/inlineError/InlineError";

const MaterialForm = ({ mode, inputs, title }) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState("");
  const [errors, setErrors] = useState({});
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { id: mainId, materialId } = useParams();
  const id = mainId || materialId;
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const classes = useSelector(selectAvailableClasses);

  // For Edit mode: fetch data
  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, materialsConst) : null
  );

  useEffect(() => {
    if (data?.classID) {
      setClassId(data.classID._id || data.classID);
    }
    setInfo(data);
  }, [data]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateMaterial);
  };

  const handleDeleteImage = () => {
    setIsImageDeleted(!isImageDeleted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newInfo = {
        classID: classId || info.classID?._id,
        ...info,
        isImageDeleted,
      };

      const res = await (mode === "create"
        ? createElementWithPicture(file, newInfo, "material", postURLs(materialsConst, "normal"))
        : editElementWithPicture(file, newInfo, "material", putURLs("materials", id))
      );

      if (checkSuccess(res.data.status)) {
        navigate(`/${user.role}/materials`);
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
    setFile(null);
    setErrors({});
    setClassId("");
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading material data"
        message={error.response?.data?.message || error.message}
        onRetry={reFetch}
      />
    );
  }

  return (
    <div className='new'>
      <div className="new-container">
        <div className="top">
          {title}
        </div>
        <div className="bottom">
          <div className="form-container">
            <FileUpload
              file={file}
              setFile={setFile}
              existingUrl={mode === "edit" ? info.fileUrl : ""}
              label="File"
              accept=".jpg,.png,.jpeg,.pdf"
              showPreview={false}
              showFileName
              showViewLink
              onDeleteImage={mode === "edit" ? handleDeleteImage : null}
              isImageDeleted={mode === "edit" ? isImageDeleted : false}
            />
            <form>
              <Dropdown
                title="Choose Class"
                id="classID"
                options={classes}
                value={classId || info?.classID?._id || ""}
                onChange={(e) => setClassId(e.target.value)}
              />
              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
                type={mode === "edit" ? "edit" : "create"}
              />
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "uploading material..." : "editing material..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button onClick={handleSubmit} disabled={loading} className="form-btn">
                {mode === "create" ? "Upload Material" : "Edit Material"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialForm;
