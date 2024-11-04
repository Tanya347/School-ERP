import "../../config/style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../config/service/useFetch";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { ClipLoader } from "react-spinners";
import { editElementWithPicture } from "../../config/service/usePut";

const EditCourse = ({ title }) => {
  
  // get location and extract id out of it
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  // fetch data using id
  const { data } = useFetch(getSingleData(id, "courses"))

  const navigate = useNavigate();

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
    setInfo(data)
  }, [data])

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  // update the data in the data base using put method
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await editElementWithPicture(file, info, "course", putURLs("courses", id));
      if(res.data.status === 'success') {
        navigate('/admin/courses');
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
        <AdminNavbar />

        {/* Title of form */}
        <div className="top">
          <h1>{title}</h1>
        </div>

        {/* Form */}
        <div className="bottom">
          <div className="right">
          <div className="left">
            <img
              src={
                (file)
                  ? URL.createObjectURL(file)
                  : (info.profilePicture) ? info.profilePicture : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
              <div className="formInput" >
                <label>Course Name</label>
                <input
                  id="name"
                  onChange={handleChange}
                  type="text"
                  placeholder="Add name of the course"
                  value={info.name}
                />
              </div>

              <div className="formInput">
                <label>Subject Code</label>
                <input
                  id="subjectCode"
                  onChange={handleChange}
                  type="text"
                  value={info.subjectCode}
                  placeholder="Add unique code of subject"
                />
              </div>

            </form>

            {/* Submit Button */}
            <div className="submitButton">
              {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing course...
              </div>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit Course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
