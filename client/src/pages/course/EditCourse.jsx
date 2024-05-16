import "../../style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import useFetch from "../../hooks/useFetch";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
const EditCourse = ({ title }) => {
  
  // get location and extract id out of it
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");

  // fetch data using id
  const { data } = useFetch(`/courses/single/${id}`)

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

    if(file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");

      try {
        const uploadRes = await axios.post( "https://api.cloudinary.com/v1_1/dnzkakna0/image/upload",
        data, {
        withCredentials: false
      })
      const {url} = uploadRes.data;
      const {public_id} = uploadRes.data;
      const newcourse = {
        ...info, syllabusPicture: url, cloud_id: public_id
      }

      await axios.put(`http://localhost:5500/api/courses/${id}`, newcourse, {
          withCredentials: false
        });
      }
      catch (err) {
        console.log(err)
      }
    }
    else {

      try {
  
        await axios.put(`http://localhost:5500/api/courses/${id}`, info, {
          withCredentials: false
        });
  
        // go back to previous page
        navigate(-1)
      }
    catch (err) {
      console.log(err)
    }
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
              <button onClick={handleClick} id="submit" className="form-btn">Edit Course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
