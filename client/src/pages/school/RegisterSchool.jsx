import './registerSchool.scss'

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createElementWithPicture } from '../../config/service/usePost';
import { postURLs } from '../../config/endpoints/post';

import Loader from '../../components/shared/loader/Loader';

const RegisterSchool = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    const button = document.getElementsByClassName("lButton")
    button.disabled = "true"
    setLoading(true)
    try {
      const res = await createElementWithPicture(file, info, "school", postURLs("schools", "normal"))
      if(res.data.status === 'success') {
        navigate("/adminLogin")
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setFile("");
    window.location.reload(false);
  }

  return (
    <div className='register-school-container'>
      <div className='register-school'>
          <h1>Welcome to ERP Portal!</h1>
          <p>Register your school with us, get your admin credentials and password and utilize the benefits we offer in just a few simple steps</p>
          
          <div className="logo-uploader">
              <label>Upload School Logo</label>
              <img
                  src={
                      file
                      ? URL.createObjectURL(file)
                      : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                  }
                  alt=""
              />

              <div className="logo-input">
                  <label htmlFor="file">
                    Logo: <DriveFolderUploadIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
              </div>
          </div>

          <label htmlFor="name">Enter Name</label>
          <input
            type="text"
            placeholder="School name"
            id="name"
            onChange={handleChange}
            className="lInput"
          />

          <label htmlFor="principal">Enter Principal Name <span className='optional'>(optional)</span></label>
          <input
            type="text"
            placeholder="Principal"
            id="principal"
            onChange={handleChange}
            className="lInput"
          />

          <label htmlFor="viceprincipal">Enter Vice-Principal Name <span className='optional'>(optional)</span></label>
          <input
            type="text"
            placeholder="Vice principal"
            id="viceprincipal"
            onChange={handleChange}
            className="lInput"
          />

          <label htmlFor="address">Enter School Address</label>
          <input
            type="text"
            placeholder="School address"
            id="address"
            onChange={handleChange}
            className="lInput"
          />

          <label htmlFor="email">Enter School Email</label>
          <input
            type="text"
            placeholder="School email"
            id="email"
            onChange={handleChange}
            className="lInput"
          />

          <label htmlFor="phone">Enter Reception Phone Number</label>
          <input
            type="text"
            placeholder="Phone number"
            id="phone"
            onChange={handleChange}
            className="lInput"
          />

          <label htmlFor="phone">Enter School Moto</label>
          <input
            type="text"
            placeholder="School Moto"
            id="moto"
            onChange={handleChange}
            className="lInput"
          />

        
          <div className="submitButton">
            {loading && <Loader text="Registering School..." />}
            <button className="clear-btn" onClick={handleClear}>Clear</button>
            <button onClick={handleClick} className="lButton">
              Register School
            </button>
          </div>
      </div>
    </div>
  )
}

export default RegisterSchool