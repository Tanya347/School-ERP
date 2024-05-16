import "../../style/form.scss";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";

const NewVideo = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [sclass, setSclass] = useState("");
  const [subject, setSubject] = useState(""); 

  const { user } = useContext(AuthContext)
  const classes = useFetch(`/faculties/classes/${user._id}`).data
  const courses = useFetch(`/faculties/courses/${user._id}`).data; 

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    const button = document.getElementsByClassName("form-btn")
    button.disabled = "true"
    e.preventDefault();
    try {
      const newVideo = {
        ...info, faculty: user._id, standard: sclass, subject: subject
      }
      await axios.post("http://localhost:5500/api/video", newVideo, {
        withCredentials: false
      });
      navigate('/facVideo/'); 
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div className="new">

      <div className="newContainer">
        <Navbar />
        
        <div className="top">
          <h1>{title}</h1>
        </div>
        
        <div className="bottom">
          <div className="right">
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
                <label>Choose a Class</label>
                <select
                  onChange={(e) => setSclass(e.target.value)}
                  id="classId">
                    <option>-</option>
                    {
                      classes && classes.length > 0 &&
                      classes.map((cl, index) => (
                        <option key={index} value={cl._id}>{cl.name}</option>
                      ))
                    }
                </select>
              </div>

              
              <div className="formInput">
                <label>Choose the Subject</label>
                <select
                  onChange={(e) => setSubject(e.target.value)}
                  id="subjectid">
                    <option>-</option>
                    {
                      courses && courses.length > 0 &&
                      courses.map((cl, index) => (
                        <option key={index} value={cl._id}>{cl.name}</option>
                      ))
                    }
                </select>
              </div>
                
            </form>
            <div className="submitButton">
              <button onClick={handleClick} className="form-btn">Upload Video</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVideo;
