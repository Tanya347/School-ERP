import "../../utils/style/form.scss";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import { createElementWithPicture } from '../../utils/service/usePost';
import { postURLs } from '../../utils/endpoints/post';
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { validateMaterial } from '../../utils/validators/material';
import { selectAvailableClasses } from "../../utils/store/selectors/classSelectors";
import { materialsConst } from "../../utils/shared/constants";

import Dropdown from '../../components/shared/dropdown/Dropdown';
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";

const UploadMaterial = ({title, inputs}) => {

  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sclass, setSclass] = useState("");

  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const classes = useSelector(selectAvailableClasses);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateMaterial);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await createElementWithPicture(file, info, "material", postURLs(materialsConst, "normal"));

      if(checkSuccess(res.data.status)) {
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
    setFile("");
    setErrors({});
    setSclass("");
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
              existingUrl={info.fileUrl}
              label="File"
              accept=".jpg,.png,.jpeg,.pdf"
              showPreview={false}
              showFileName
              showViewLink
            />


            <form>
              <Dropdown
                id="classId"
                title="Choose Class"
                options={classes}
                onChange={(e) => {
                  handleChange(e);
                  setSclass(e.target.value);
                }}
                value={sclass}
              />
              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />
            </form>
            <div className="submit-button">
            { loading && <Loader text="uploading material..."/>}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleSubmit} disabled={loading} className="form-btn">Upload Material</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterial;
