import { useEffect, useState } from 'react';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import "../../config/style/form.scss";
import { getClasses, getSingleData } from "../../config/endpoints/get";
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { materialInputs } from '../../config/formsource/materialInputs';
import useFetch from '../../config/service/useFetch';
import { editElementWithPicture } from '../../config/service/usePut';
import { putURLs } from '../../config/endpoints/put';
import Loader from '../../components/loader/Loader';
import { validateMaterial }from "../../config/validators/material"
import { handleChange as commonHandleChange } from '../../config/commons';

const EditMaterial = ({title}) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
    const id = location.pathname.split("/")[4];

  const { data, dataloading } = useFetch(getSingleData(id, "materials"));
  const classes = useFetch(getClasses).data;

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
      if(classId) {
        info.classId = classId;
      } else {
        info.classId = info.classId?._id || info.classId;
      }
      const res = await editElementWithPicture(file, info, "material", putURLs("materials", id));

      if(res.data.status === 'success') {
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
          <div className="newContainer">
            <div className="top">
              {title}
            </div>
            <div className="bottom">
              <div className="right">
                <div className="left">
                  <div className="formInput">
                    <label htmlFor="file">
                      File: <DriveFolderUploadIcon className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      accept=".jpg,.png,.jpeg,.pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    {file && (
                      <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{file.name}</span>
                    )}
                  </div>
                </div>

                <form>
                  <div className="formInput">
                    <label>Choose a Class</label>
                    <select
                      onChange={(e) => setClassId(e.target.value)}
                      id="classId">
                        {
                          classes && classes.length > 0 &&
                          classes?.map((cl, index) => (
                            <option key={index} value={cl._id} selected={info?.classId?._id === cl._id}>{cl.name}</option>
                            ))
                          }
                    </select>
                  </div>
                  {materialInputs?.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input
                        id={input.id}
                        onChange={handleChange}
                        type={input.type}
                        placeholder={input.placeholder}
                        value={info[input.id] || ""}
                        className={errors[input.id] ? "error-input" : ""}
                      />
                      {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                    </div>
                  ))}
                </form>
                <div className="submitButton">
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
