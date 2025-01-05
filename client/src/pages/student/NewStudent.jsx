import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { createElementWithPicture } from "../../config/service/usePost";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { getClasses } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import Dropdown from "../../components/dropdown/Dropdown";

const NewUser = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }
  
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await createElementWithPicture(file, info, "student", postURLs("student", "register"));
      if(res.data.status === 'success') {
        navigate(`/admin/students/single/${res.data.data.user._id}`);
      }
    }
    catch(err) {
      console.log(err);
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
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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

            <Dropdown
              id="gender"
              title="Gender"
              options={[
                { _id: 'Male', name: 'Male' },
                { _id: 'Female', name: 'Female' },
              ]}
              onChange={handleChange}
            />

              {inputs?.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}

              <Dropdown
                id="class"
                title="Choose Class"
                url={getClasses}
                onChange={handleChange}
              />

            </form>
            <div className="submitButton">
            { loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                creating student...
              </div>}
              <button onClick={handleClick} disabled={loading} className="form-btn">Create Student</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
