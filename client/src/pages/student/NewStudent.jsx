import "../../style/form.scss";

// choice for gender, year, department

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from "axios"

import AdminNavbar from "../../components/navbar/AdminNavbar";
import useFetch from "../../config/hooks/useFetch";
import { postURLs } from "../../source/endpoints/post";
import { getClasses } from "../../source/endpoints/get";

const NewUser = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const classes = useFetch(getClasses).data
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  
  const handleClick = async (e) => {
    e.preventDefault();
    
    if (file) {

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");
      
      try {
        const uploadRes = await axios.post(
          process.env.REACT_APP_CLOUDINARY,
          data, {
            withCredentials: false
          }
        )
        const { url } = uploadRes.data;
        const { public_id } = uploadRes.data;
        const newuser = {
          ...info, profilePicture: url, cloud_id: public_id
        }
        console.log(newuser)

        axios.post(postURLs("students", "register"), newuser, {
          withCredentials: false
        })
        navigate(-1)

      } catch (error) {
        console.log(error)
      }
    
    } else {
      try {
        await axios.post(postURLs("students", "register"), info, {
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


              <div className="formInput">
                <label>Choose a Class</label>
                <select
                  id="class"
                  onChange={handleChange}
                >
                  <option value={"-"}> </option>
                  {
                    classes&& classes.map((c, index) => (
                      <option value={c._id} key={index}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

            </form>
            <div className="submitButton">
              <button onClick={handleClick} className="form-btn">Create Student</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
