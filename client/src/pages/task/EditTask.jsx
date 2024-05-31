import "../../style/form.scss";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import useFetch from "../../config/hooks/useFetch";
import { AuthContext } from "../../config/context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import { getFacultyData, getSingleData } from "../../source/endpoints/get";
import { putURLs } from "../../source/endpoints/put";

const EditTask = ({ title }) => {
  
  // get location and extract id out of it
  const { user } = useContext(AuthContext)

  const location = useLocation();
  const id = location.pathname.split("/")[4];

  const classes = useFetch(getFacultyData(user._id, "classes")).data
  const { data } = useFetch(getSingleData(id, "tasks"))
  
  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(new Date());
  const [sclass, setSclass] = useState("");

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
      if(deadline)
        info.deadline = deadline
      if(sclass)
        info.sclass = sclass
      
      await axios.put(putURLs("tasks", id), info, {
        withCredentials: false
      });

      // go back to previous page
      navigate(-1)
    } catch (err) {
      console.log(err)
    }
  } 


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
                <label>Task Name</label>
                <input
                  id="title"
                  onChange={handleChange}
                  type="text"
                  placeholder="Add title of task"
                  value={info.title}
                />
              </div>

              <div className="formInput" >
                <label>Description</label>
                <input
                  id="desc"
                  onChange={handleChange}
                  type="text"
                  value={info.desc}
                  placeholder="Add task desciption"
                />
              </div>

            <div className="formInput">
                <label>Choose a Class</label>
                <select
                  onChange={(e) => setSclass(e.target.value)}
                  id="classId">
                    {
                      classes && classes.length > 0 &&
                      classes?.map((cl, index) => (
                        <option key={index} value={cl._id} selected={info?.sclass?._id === cl._id}>{cl.name}</option>
                        ))
                      }
                </select>
              </div>

              <div className="formInput">

                <label>Set Deadline<span style={{color: "green", fontWeight: "bold"}}>Original Date: {new Date(info.deadline).toLocaleDateString()}</span></label>
                <DatePicker
                  class="date-picker"
                  placeholderText="Choose Date and Time"
                  style={{ marginRight: "10px" }}
                  selected={deadline}
                  className="formInput"
                  onChange={(selectedDate) => {
                    // Set only the date part to the state
                    const dateWithoutTime = new Date(selectedDate.setHours(0, 0, 0, 0));
                    setDeadline(dateWithoutTime);
                  }}
                  />
              </div>
                  </form>

            {/* Submit Button */}
            <div className="submitButton">
              <button onClick={handleClick} id="submit" className="form-btn">Edit Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
