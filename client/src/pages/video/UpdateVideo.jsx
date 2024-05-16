import "../../style/form.scss";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";

const UpdateVideo = ({ title }) => {
  
  // get location and extract id out of it
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [info, setInfo] = useState({});
  const { user } = useContext(AuthContext)
  const classes = useFetch(`/faculties/classes/${user._id}`).data
  const courses = useFetch(`/faculties/courses/${user._id}`).data; 

  
  const { data } = useFetch(`/video/${id}`)
  const [sclass, setSclass] = useState("");
  const [subject, setSubject] = useState(""); 


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
    try {
      if(sclass)
        info.sclass = sclass
    
      if (subject)
        info.subject = subject
      
      await axios.put(`http://localhost:5500/api/video/${id}`, info, {
        withCredentials: false
      });

      // go back to previous page
      navigate(-1)
    } catch (err) {
      console.log(err)
    }
  } 

  console.log(info)
  return (
    <div className="new">

      <div className="newContainer">
        <Navbar />

        {/* Title of form */}
        <div className="top">
          <h1>{title}</h1>
        </div>

        {/* Form */}
        <div className="bottom">
          <div className="right">
            
            <form>
              <div className="formInput" >
                <label>Video Title</label>
                <input
                  id="title"
                  onChange={handleChange}
                  type="text"
                  placeholder="Add title of video"
                  value={info.title}
                />
              </div>

              <div className="formInput" >
                <label>Topic</label>
                <input
                  id="topic"
                  onChange={handleChange}
                  type="text"
                  value={info.topic}
                  placeholder="Add topics related to task"
                />
              </div>

              <div className="formInput" >
                <label>Link</label>
                <input
                  id="topic"
                  onChange={handleChange}
                  type="text"
                  value={info.link}
                  placeholder="Add topics related to task"
                />
              </div>

            <div className="formInput">
                <label>Choose a Class</label>
                <select
                  onChange={(e) => setSclass(e.target.value)}
                  id="standard">
                    {
                      classes && classes.length > 0 &&
                      classes.map((cl, index) => (
                        <option key={index} value={cl._id} selected={info?.standard?._id === cl._id}>{cl.name}</option>
                        ))
                      }
                </select>
              </div>

              
              <div className="formInput">
                <label>Choose the Subject</label>
                <select
                  onChange={(e) => setSubject(e.target.value)}
                  id="subject">
                    <option>-</option>
                    {
                      courses && courses.length > 0 &&
                      courses.map((cl, index) => (
                        <option key={index} value={cl._id} selected={info?.subject?._id === cl._id}>{cl.name}</option>
                      ))
                    }
                </select>
              </div>


                  </form>

            {/* Submit Button */}
            <div className="submitButton">
              <button onClick={handleClick} id="submit" className="form-btn">Update video</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateVideo;
