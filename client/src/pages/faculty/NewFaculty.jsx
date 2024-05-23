import "../../style/form.scss";

// choice for gender, designation, department

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "../../config/hooks/useFetch";


import axios from "axios"

import AdminNavbar from "../../components/navbar/AdminNavbar";
import { getClasses } from "../../source/endpoints/get";
import { postURLs } from "../../source/endpoints/post";

const NewFaculty = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [classCode, setClasscode] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const courses = useFetch(getClasses).data;
  const [deptCourse, setDeptCourse] = useState();

  useEffect(() => {
    setDeptCourse(courses.filter((c) => info.department === c.department))
  })


  const handleClick = async (e) => {
    e.preventDefault();
    
    if (file) {

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");

      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnzkakna0/image/upload",
          data, {
          withCredentials: false
        }
        )
        const { url } = uploadRes.data;
        const { public_id } = uploadRes.data;
        const newuser = {
          ...info, profilePicture: url, cloud_id: public_id, classCode: classCode
        }

        axios.post("http://localhost:5500/api/faculties/registerFaculty", newuser, {
          withCredentials: false
        })
        navigate(-1)

      } catch (error) {
        console.log(error)
      }
    
    } else {
      try {
        await axios.post(postURLs("faculties", "register"), info, {
          withCredentials: false
        })
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

              <div className="formInput">
                <label>Gender</label>
                <select
                  id="gender"
                  onChange={handleChange}
                >
                  <option value={0}>-</option>
                  <option value={"Female"}>Female</option>
                  <option value={"Male"}>Male</option>
                </select>
              </div>

              {inputs.map((input) => (
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


            </form>
            <div className="submitButton">
              <button onClick={handleClick} className="form-btn">Create Faculty</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFaculty;
