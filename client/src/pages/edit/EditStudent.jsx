import "../../utils/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { putURLs } from "../../utils/endpoints/put";
import { editElementWithPicture } from "../../utils/service/usePut";
import { studentInputs } from "../../utils/formsource/studentInputs";
import { validateStudent } from "../../utils/validators/student";
import { checkAdmin, checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { genderTypes } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditUser = ({ title }) => {

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [sclass, setSclass] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  let id;
 
  const classes = useSelector(state => state.admin.classes);
  const { user } = useSelector(state => state.auth);
  
  if(checkAdmin(user.role)) 
    id = location.pathname.split("/")[4];
  else
    id = location.pathname.split("/")[3];

  const { data, loading } = useFetch(getSingleData(id, "single-student"))

  useEffect(() => {
    setInfo(data)
  }, [data])

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateStudent);
  }

  const handleDeleteImage = () => {
    setIsImageDeleted(!isImageDeleted);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setSending(true)
    try {
      const newInfo = {
        name: info.name,
        username: info.username,
        email: info.email,
        enroll: info.enroll,
        studentPhone: info.studentPhone,
        studentAddress: info.studentAddress,
        dob: info.dob,
        gender: info.gender,
        ...(checkAdmin(user.role) && { classID: sclass || info.classID._id }),
        isImageDeleted
      }
      const res = await editElementWithPicture(file, newInfo, "student", putURLs("students", id));
      if(checkSuccess(res.data.status)) {
        navigate(`/admin/students/single/${id}`);
        window.location.reload();
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
          <div className="new-container">
            <div className="top">
              <h1>{title}</h1>
            </div>
            <div className="bottom">
              <div className="form-container">
              <FileUpload
                file={file}
                setFile={setFile}
                existingUrl={info.profilePicture}
                label="Profile Picture"
                onDeleteImage={handleDeleteImage}
                isImageDeleted={isImageDeleted}
              />


                <form>

                  <FormInputs
                    inputs={studentInputs}
                    values={info}
                    errors={errors}
                    onChange={handleChange}
                    role={user.role}
                    type="edit"
                  />

                  {user?.role === "admin" && <Dropdown
                    id="gender"
                    title="Gender"
                    options={genderTypes}
                    value={info.gender}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />}

                  {checkAdmin(user.role) && <Dropdown
                    id="classID"
                    title="Choose Class"
                    options={classes}
                    value={sclass || info?.classID?._id || ""}
                    onChange={(e) => {
                      setSclass(e.target.value);
                      handleChange(e);
                    }}
                  />
                  }

                </form>

                <div className="submit-button">
                  {sending && <Loader text="editing student..."/>}
                  <button className="form-btn" disabled={sending} id="submit" onClick={handleClick}>Edit Student</button>
                </div>
              
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditUser;
