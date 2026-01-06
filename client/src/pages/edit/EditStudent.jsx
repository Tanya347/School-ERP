import "../../config/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { editElementWithPicture } from "../../config/service/usePut";
import { studentInputs } from "../../config/formsource/studentInputs";
import { validateStudent } from "../../config/validators/student";
import { handleChange as commonHandleChange } from "../../config/utils/commons";
import { genderTypes, roles, successMsg } from "../../config/utils/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditUser = ({ title }) => {

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  
  const location = useLocation();
  const navigate = useNavigate();
  
  let id;
 
  const classes = useSelector(state => state.admin.classes);
  const { user } = useSelector(state => state.auth);
  
  if(user.role === roles.admin) 
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

  const handleClick = async (e) => {
    e.preventDefault();
    setSending(true)
    try {
      const newInfo = {
        name: info.name,
        username: info.name,
        email: info.email,
        enroll: info.enroll,
        studentPhone: info.studentPhone,
        studentAddress: info.studentAddress,
        dob: info.dob,
        gender: info.gender,
        class: info.class
      }
      const res = await editElementWithPicture(file, newInfo, "student", putURLs("students", id));
      if(res.data.status === successMsg) {
        navigate(`/admin/students/single/${id}`);
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
              <div className="right">
              <FileUpload
                file={file}
                setFile={setFile}
                existingUrl={info.profilePicture}
                label="Profile Picture"
              />


                <form>

                  <FormInputs
                    inputs={studentInputs}
                    values={info}
                    errors={errors}
                    onChange={handleChange}
                  />

                  <Dropdown
                    id="gender"
                    title="Gender"
                    options={genderTypes}
                    value={info.gender}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />

                  {user.role=== roles.admin && <Dropdown
                    id="class"
                    title="Choose Class"
                    options={classes}
                    value={info?.sclass.name}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />}

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
