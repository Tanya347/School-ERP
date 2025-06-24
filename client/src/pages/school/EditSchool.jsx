import "../../config/style/form.scss";
import { schoolInputs } from "../../config/formsource/schoolInputs"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../config/service/useFetch";
import { getSingleData } from "../../config/endpoints/get";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { ClipLoader } from "react-spinners";
import { editElementWithPicture } from "../../config/service/usePut";
import { putURLs } from "../../config/endpoints/put";

const EditSchool = ({title}) => {

  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const {data} = useFetch(getSingleData(id, "schools"));

  const navigate = useNavigate();

  useEffect(() => {
    setInfo(data)
  }, [data])
  console.log(info)
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await editElementWithPicture(file, info, "school", putURLs("schools", id));
      if(res.data.status === 'success') {
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
                    : (info?.logo) ? info.logo : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
              />
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadIcon className="icon" />
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
                {schoolInputs.map((field) => (
                  <div className="formInput">
                    <label>{field.label}</label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      value={info[field.id] || ""}
                    />
                  </div>
                ))}
            </form>

            <div className="submitButton">
              {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing school information...
              </div>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit School</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default EditSchool