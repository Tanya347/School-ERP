import "../../config/style/form.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { schoolInputs } from "../../config/formsource/schoolInputs"
import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import { editElementWithPicture } from "../../config/service/usePut";
import { putURLs } from "../../config/endpoints/put";
import { schoolsConst, successMsg } from "../../config/utils/constants";

import Loader from "../../components/shared/loader/Loader"
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";

const EditSchool = ({title}) => {

  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[4];

  const {data} = useFetch(getSingleData(id, schoolsConst));

  useEffect(() => {
    setInfo(data)
  }, [data])
  
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await editElementWithPicture(file, info, "school", putURLs(schoolsConst, id));
      if(res.data.status === successMsg) {
        navigate('/admin');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="new">
      <div className="new-container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <FileUpload
              file={file}
              setFile={setFile}
              existingUrl={info?.logo}
              label="Logo"
            />

            <form>
                <FormInputs
                  inputs={schoolInputs}
                  values={info}
                  onChange={handleChange}
                />
            </form>

            <div className="submit-button">
              {loading && <Loader text="editing school..."/>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit School</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default EditSchool