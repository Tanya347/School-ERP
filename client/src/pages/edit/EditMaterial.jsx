import "../../utils/style/form.scss";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"

import { getSingleData } from "../../utils/endpoints/get";
import { materialInputs } from '../../utils/formsource/materialInputs';
import useFetch from '../../utils/service/useFetch';
import { editElementWithPicture } from '../../utils/service/usePut';
import { putURLs } from '../../utils/endpoints/put';
import { validateMaterial }from "../../utils/validators/material"
import { checkSuccess, handleChange as commonHandleChange } from '../../utils/shared/commons';
import { selectAvailableClasses } from "../../utils/store/selectors/classSelectors";
import { materialsConst } from "../../utils/shared/constants";

import Loader from '../../components/shared/loader/Loader';
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditMaterial = ({title}) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.pathname.split("/")[4];

  const { data, dataloading } = useFetch(getSingleData(id, materialsConst));
  const classes = useSelector(selectAvailableClasses);


  useEffect(() => {
    if (data?.classId) {
      setClassId(data.classId._id || data.classId);
    }
  }, [data]);

  useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateMaterial);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {

      const newInfo = {
        classId: classId || info.classId?._id,
        name: info.name,
        description: info.description
      }

      const res = await editElementWithPicture(file, newInfo, "material", putURLs("materials", id));

      if(checkSuccess(res.data.status)) {
        navigate('/admin/materials');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='new'>
      {dataloading ? (
        <Loader text="Loading data.." type="global"/>
      ) : (
        <>
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
                    title="Choose Class"
                    id="classId"
                    options={classes}
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  />

                   <FormInputs
                    inputs={materialInputs}
                    values={info}
                    errors={errors}
                    onChange={handleChange}
                  />
                </form>
                <div className="submit-button">
                { loading && <Loader text="editing material..."/>}
                  <button onClick={handleSubmit} disabled={loading} className="form-btn">Edit Material</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditMaterial;
