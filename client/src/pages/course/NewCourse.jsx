import "../../style/form.scss";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";

const NewCourse = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const classes = useFetch('/classes').data
  classes.sort((a, b) => a.classNumber - b.classNumber)

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    const button = document.getElementsByClassName("form-btn")
    button.disabled = "true"
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
  
        await axios.post("http://localhost:5500/api/courses", newcourse, {
          withCredentials: false
        });
        navigate(-1)
      } catch (err) {
        console.log(err)
      }
    }
    else {
      try {
        const newcourse = {
          ...info,
        }
  
        await axios.post("http://localhost:5500/api/courses", newcourse, {
          withCredentials: false
        });
        navigate(-1)
      } catch (err) {
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
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

            <div className="formInput">
                <label>Choose Class</label>
                <select id="class" onChange={handleChange}>
                    <option value={"-"}> </option>
                    {
                        classes?.map((c, index) => (
                        <option value={c._id} key={index}>
                          {c.name}
                        </option>
                        ))
                    }
                </select>
            </div>  

            </form>
            <div className="submitButton">
              <button onClick={handleClick} className="form-btn">Create Course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
