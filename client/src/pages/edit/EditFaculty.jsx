import "../../config/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { editElementWithPicture } from "../../config/service/usePut";
import { facultyInputs } from "../../config/formsource/facultyInputs";
import { validateFaculty } from "../../config/validators/faculty"
import { facultiesConst, genderTypes, successMsg } from "../../config/utils/constants";
import { handleChange as commonHandleChange } from "../../config/utils/commons";
import { roles } from "../../config/utils/constants"

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditFaculty = ({ title }) => {

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  let id;
  const { user } = useSelector(state => state.auth);
  
  if (user.role === roles.admin)
    id = location.pathname.split("/")[4];
  else
    id = location.pathname.split("/")[3];

  const { data, loading } = useFetch(getSingleData(id, facultiesConst))

  useEffect(() => {
    setInfo(data)
  }, [data])


  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateFaculty);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setSending(true)
    try {
      const newInfo = {
        gender: info.gender,
        teachername: info.teachername,
        username: info.username,
        email: info.email,
        enroll: info.enroll,
        facultyPhone: info.facultyPhone,
        facultyAddress: info.facultyAddress,
        dob: info.dob,
        joiningYear: info.joiningYear
      }
      const res = await editElementWithPicture(file, newInfo, "faculty", putURLs(facultiesConst, id));
      if(res.data.status === successMsg) {
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
                    inputs={facultyInputs}
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

                </form>
                <div className="submit-button">
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
