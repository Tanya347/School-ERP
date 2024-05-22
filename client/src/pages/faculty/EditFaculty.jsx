import "../../style/form.scss";

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useFetch from "../../config/hooks/useFetch";
import axios from "axios"

import Navbar from "../../components/navbar/Navbar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { departments} from "../../source/formsource/arrays";


const EditFaculty = ({ title, type }) => {

  const location = useLocation();
  let id;
  if (type === "Admin")
    id = location.pathname.split("/")[3];
  else
    id = location.pathname.split("/")[2];

  const { data } = useFetch(`/faculties/${id}`)
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [sending, setSending] = useState(false)
  const [classCode, setClasscode] = useState("");

  useEffect(() => {
    setInfo(data)
  }, [data])



  const navigate = useNavigate();
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setSending(true)
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

        axios.put(`http://localhost:5500/api/faculties/${id}`, newuser, {
          withCredentials: false
        })
        navigate(-1)

      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await axios.put(`http://localhost:5500/api/faculties/${id}`, info, { withCredentials: false })
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
        {(type === "Admin") ? (<AdminNavbar />) : (<Navbar />)}
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

              {type === "Admin" && <div className="formInput">
                <label>Username</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter username"
                  id="username"
                  value={info.username}
                />
              </div>}

              {type === "Admin" && <div className="formInput">
                <label>Registration Number</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter registration number"
                  id="enroll"
                  value={info.enroll}
                />
              </div>}

              <div className="formInput">
                <label>Gender</label>
                <select
                  id="gender"
                  onChange={handleChange}
                  value={info.gender}
                >
                  <option value={0}>-</option>
                  <option value={"Female"}>Female</option>
                  <option value={"Male"}>Male</option>
                </select>
              </div>

              <div className="formInput">
                <label>Name</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter name"
                  id="teachername"
                  value={info.teachername}
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter email"
                  id="email"
                  value={info.email}
                />
              </div>

              <div className="formInput">
                <label>Phone Number</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter faculty's phone number"
                  id="facultyPhone"
                  value={info.facultyPhone}
                />
              </div>

              <div className="formInput">
                <label>Address</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter faculty's address"
                  id="facultyAddress"
                  value={info.facultyAddress}
                />
              </div>

              <div className="formInput">
                <label>Date of Birth</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter faculty's date of birth"
                  id="dob"
                  value={info.dob}
                />
              </div>

              <div className="formInput">
                <label>Joining Year</label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter faculty's joining year"
                  id="joiningYear"
                  value={info.joiningYear}
                />
              </div>

            </form>
            <div className="submitButton">
              <button className="form-btn" disabled={sending} id="submit" onClick={handleClick}>Edit User</button>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFaculty;
