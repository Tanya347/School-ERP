import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { editElementWithPicture } from "../../config/service/usePut";
import { facultyInputs } from "../../config/formsource/facultyInputs";
import { useAuth } from "../../config/context/AuthContext";
import { validateFaculty } from "../../config/validators/faculty"
import { handleChange as commonHandleChange } from "../../config/commons";

import Loader from "../../components/shared/loader/Loader";

const EditFaculty = ({ title }) => {

  const location = useLocation();
  let id;
  const { user } = useAuth();
  if (user.role === "admin")
    id = location.pathname.split("/")[4];
  else
    id = location.pathname.split("/")[3];

  const { data, loading } = useFetch(getSingleData(id, "faculties"))
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setInfo(data)
  }, [data])


  const navigate = useNavigate();
  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateFaculty);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setSending(true)
    try {
      const res = await editElementWithPicture(file, info, "faculty", putURLs("faculties", id));
      if(res.data.status === 'success') {
        navigate(`/admin/faculties/single/${id}`)
      }
    } catch(err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="new">
      {loading ? (
        <Loader text="Loading data..." type="global" />
      ) : (
        <>
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
                      : (info.profilePicture) ? info.profilePicture : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                  }
                  alt=""
                />

                <div className="formInput">
                    <label htmlFor="file">
                      Profile Picture: <DriveFolderUploadIcon className="icon" />
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

                  {facultyInputs.map((field) => (
                      (field.editAccess === user.role || field.editAccess === "both") && <div className="formInput" key={field.id}>
                        <label>{field.label}</label>
                        <input 
                          id={field.id}
                          type={field.type}
                          value={info[field.id] || ''}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={errors[field.id] ? "error-input" : ""}
                        />
                        {errors[field.id] && <span className="error-message">{errors[field.id]}</span>}
                      </div>
                  ))}

                  <div className="formInput">
                    <label>Gender</label>
                    <select
                      id="gender"
                      onChange={handleChange}
                      value={info.gender}
                    >
                      <option value={0}>-</option>
                      <option value={"Female"}>Female</option>
                      <option value={"Male"}>Male</option>
                    </select>
                  </div>

                </form>
                <div className="submitButton">
                  {sending && <Loader text="editing faculty..." />}
                  <button className="form-btn" disabled={sending} id="submit" onClick={handleClick}>Edit User</button>
                </div>

              
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditFaculty;
