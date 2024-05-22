import "../../style/form.scss";

import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";

const EditTest = ({ title }) => {
  
  // get location and extract id out of it
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [info, setInfo] = useState({});
  const { user } = useContext(AuthContext)
  const classes = useFetch(`/faculties/classes/${user._id}`).data
  const courses = useFetch(`/faculties/courses/${user._id}`).data
  
  const { data } = useFetch(`/tests/${id}`)
  const [date, setDate] = useState(new Date());
  const [sclass, setSclass] = useState("");
  const [course, setCourse] = useState("");


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
      if(date)
        info.date = date
      if(sclass)
        info.sclass = sclass
      if(course)
        info.subject = course
      
      await axios.put(`http://localhost:5500/api/tests/${id}`, info, {
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
                <label>Test Name</label>
                <input
                  id="name"
                  onChange={handleChange}
                  type="text"
                  placeholder="Add name of task"
                  value={info.name}
                />
              </div>

              <div className="formInput" >
                <label>Syllabus</label>
                <input
                  id="syllabus"
                  onChange={handleChange}
                  type="text"
                  value={info.syllabus}
                  placeholder="Add test syllabus"
                />
              </div>

              <div className="formInput" >
                <label>Total Marks</label>
                <input
                  id="totalMarks"
                  onChange={handleChange}
                  type="number"
                  value={info.totalMarks}
                  placeholder="Add total marks of the test"
                />
              </div>

              <div className="formInput" >
                <label>Duration</label>
                <input
                  id="duration"
                  onChange={handleChange}
                  type="number"
                  value={info.duration}
                  placeholder="Add duration of the test"
                />
              </div>

            <div className="formInput">
                <label>Choose a Class</label>
                <select
                  onChange={(e) => setSclass(e.target.value)}
                  id="classId">
                    {
                      classes && classes.length > 0 &&
                      classes.map((cl, index) => (
                        <option key={index} value={cl._id} selected={info?.sclass?._id === cl._id}>{cl.name}</option>
                        ))
                      }
                </select>
              </div>

              <div className="formInput">
                <label>Choose a Course</label>
                <select
                  onChange={(e) => setCourse(e.target.value)}
                  id="classId">
                    {
                      courses && courses.length > 0 &&
                      courses?.map((cr, index) => (
                        <option key={index} value={cr._id} selected={info?.subject?._id === cr._id}>{cr.name}</option>
                        ))
                      }
                </select>
              </div>

              <div className="formInput">

                <label>Set Deadline<span style={{color: "green", fontWeight: "bold"}}>Original Date: {new Date(info.date).toLocaleDateString()}</span></label>
                <DatePicker
                  class="date-picker"
                  placeholderText="Choose Date and Time"
                  style={{ marginRight: "10px" }}
                  selected={date}
                  className="formInput"
                  onChange={(selectedDate) => {
                    // Set only the date part to the state
                    const dateWithoutTime = new Date(selectedDate.setHours(0, 0, 0, 0));
                    setDate(dateWithoutTime);
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

export default EditTest;
