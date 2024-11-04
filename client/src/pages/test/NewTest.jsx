import "../../config/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import DatePicker from "react-datepicker";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../config/service/useFetch";
import { getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { useAuth } from "../../config/context/AuthContext";
import { ClipLoader } from "react-spinners";
import { createElement } from "../../config/service/usePost";


const NewTest = ({ title }) => {
  
  const [info, setInfo] = useState({});
  const [course, setCourse] = useState();
  const [sclass, setSclass] = useState();
  const [loading, setLoading] = useState(false);

  // dates
  const [start, setStart] = useState("")
  
  const { user } = useAuth();
  const courses = useFetch(getFacultyData(user._id, "courses")).data
  const classes = useFetch(getFacultyData(user._id, "classes")).data
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
      try {
        const newtest = {
          ...info, date: start, author: user._id, subject: course, sclass: sclass
        }
        const res = createElement(newtest, postURLs("tests", "normals"), "Test");
        if(res.data.status === 'success') {
          navigate("/faculty/tests")
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    } 

 
  return (

    <div className="new">
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="top">
          <div className="right">
            <form>
              
              {/* course */}

              <div className="formInput">
                <label>Name</label>
                <input 
                  type="text" 
                  id="name"
                  onChange={handleChange}
                  placeholder="Enter Name for the Test"
                />
              </div>

              <div className="formInput">
                <label>Select Course</label>
                <select onChange={(e) => {
                  setCourse(e.target.value);
                }} id="classId">
                  <option>-</option>
                    {courses?.map((cr, index) => (
                      <option value={cr._id} key={index}>{cr.name}</option>
                    ))}
                </select>
              </div>

              <div className="formInput">
                <label>Select Class</label>
                <select onChange={(e) => {
                  setSclass(e.target.value);
                }} id="classId">
                  <option>-</option>
                    {classes?.map((cl, index) => (
                      <option value={cl._id} key={index}>{cl.name}</option>
                    ))}
                </select>
              </div>

              <div className="formInput">
                <label>Syllabus</label>
                <input 
                  type="text" 
                  id="syllabus"
                  onChange={handleChange}
                  placeholder="Enter Syllabus for the Test"
                />
              </div>

              <DatePicker
                class="date-picker"
                showTimeSelect
                placeholderText="Date and Time"
                selected={start}
                onChange={(start) => setStart(start)}
              />

              <div className="formInput">
                <label>Duration</label>
                <input 
                  type="number" 
                  id="duration"
                  onChange={handleChange}
                  placeholder="Enter Duration of the Test in minutes"
                />
              </div>

              <div className="formInput">
                <label>Total Marks</label>
                <input 
                  type="number" 
                  id="totalMarks"
                  onChange={handleChange}
                  placeholder="Enter total marks of the Test"
                />
              </div>
            
            </form>
            <div className="submitButton">
            {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing update...
              </div>}
              <button onClick={handleClick} className="form-btn">Create Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTest;