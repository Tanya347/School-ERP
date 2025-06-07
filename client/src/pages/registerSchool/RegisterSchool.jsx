import './registerSchool.scss'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useState } from 'react';
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { createElementWithPicture } from '../../config/service/usePost';
import { postURLs } from '../../config/endpoints/post';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegisterSchool = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
              />

              <div className="logo-input">
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

          <h2>Okay for the last step, let's set up the admin credentials...</h2>
          
          <label htmlFor="username">Enter Username</label>
          <input
            type="text"
            placeholder="Admin email"
            id="username"
            onChange={handleChange}
            className="lInput"
          />

          <div className="password-input">
            <label htmlFor="phone">Enter Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin password"
              id="password"
              onChange={handleChange}
              className="lInput"
              style={{"width": "100%"}}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>

          <div className="submitButton">
            {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                registering school...
              </div>}
            <button onClick={handleClick} className="lButton">
              Register School
            </button>
          </div>
      </div>
    </div>
  )
}

export default RegisterSchool