import "../../utils/style/form.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { schoolInputs } from "../../utils/formsource/schoolInputs"
import { editElementWithPicture } from "../../utils/service/usePut";
import { putURLs } from "../../utils/endpoints/put";
import { schoolsConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader"
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import { checkSuccess } from "../../utils/shared/commons";

const EditSchool = ({title}) => {

  const [schoolInfo, setSchoolInfo] = useState({});
  const [infoloading, setInfoloading] = useState(false);
  const [file, setFile] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[4];

  const { info } = useSelector(state => state.school);

  useEffect(() => {
    setSchoolInfo(info)
  }, [info])

  const handleChange = (e) => {
    setSchoolInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setInfoloading(true)
    try {
      const res = await editElementWithPicture(file, schoolInfo, "school", putURLs(schoolsConst, id));
      if(checkSuccess(res.data.status)) {
        navigate('/admin');
        window.location.reload();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setInfoloading(false);
    }
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
              existingUrl={schoolInfo?.logo}
              label="Logo"
            />

            <form>
                <FormInputs
                  inputs={schoolInputs}
                  values={schoolInfo}
                  onChange={handleChange}
                  type="edit"
                />
            </form>

            <div className="submit-button">
              {infoloading && <Loader text="editing school..."/>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit School</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default EditSchool