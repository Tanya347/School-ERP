import "../../style/form.scss";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

import DatePicker from "react-datepicker";

import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";


const NewTest = ({ title }) => {
  
  const [info, setInfo] = useState({});

  // dates
  const [start, setStart] = useState("")

  const { user } = useContext(AuthContext)
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
   
      try {
        const newtest = {
          ...info, date: start, author: user._id
        }
        axios.post("http://localhost:5500/api/tests", newtest, { withCredentials: false })
        navigate(-1)

      } catch (error) {
        console.log(error)
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
                  type="text" 
                  id="duration"
                  onChange={handleChange}
                  placeholder="Enter Duration of the Test"
                />
              </div>
            
            </form>
            <div className="submitButton">
              <button onClick={handleClick} className="form-btn">Create Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTest;