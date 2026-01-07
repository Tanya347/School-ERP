import "../../utils/style/form.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { schoolInputs } from "../../utils/formsource/schoolInputs"
import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { editElementWithPicture } from "../../utils/service/usePut";
import { putURLs } from "../../utils/endpoints/put";
import { schoolsConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader"
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import { checkSuccess } from "../../utils/shared/commons";

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
      if(checkSuccess(res.data.status)) {
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
          <div className="form-container">
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