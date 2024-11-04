import React, { useEffect, useState } from 'react'
import "./markAttendance.scss"
import { useAuth } from '../../config/context/AuthContext'
import useFetch from '../../config/service/useFetch'
import { getFacultyData } from '../../config/endpoints/get'
import axios from "axios";
import DatePicker from 'react-datepicker'
import Navbar from "../../components/navbar/Navbar";
import { postURLs } from '../../config/endpoints/post'
import { useNavigate } from 'react-router-dom'
import { createElement } from '../../config/service/usePost'

const MarkAttendance = () => {

    const { user } = useAuth();
    const classes = useFetch(getFacultyData(user._id, "classes")).data
    const [sclass, setSclass] = useState("");
    const [className, setClassName] = useState("");
    const [stuData, setStuData] = useState({});
    const [adate, setAdate] = useState(new Date());
    const [presentStudents, setPresentStudents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
          if (sclass) {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/students/${sclass}`);
              setStuData(response.data);
            } catch (error) {
              console.error("Error fetching student data:", error);
            }
          }
        };
        fetchStudents();
      }, [sclass])

      const handleClick = (cl) => {
        setSclass(cl._id);
        setClassName(cl.name);
      };

      const handleCheckboxChange = (studentId) => {
        setPresentStudents((prev) => {
          if (prev.includes(studentId)) {
            return prev.filter((id) => id !== studentId);
          } else {
            return [...prev, studentId];
          }
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newAtt = {
                present: presentStudents,
                date: adate,
                classid: sclass,
                author: user._id
            }
            await createElement(newAtt, postURLs('attendances', "normal"), "Attendance");

            navigate("/faculty/attendance")
        }
        catch(err) {
            console.log(err)
        }
      }

    return (
        <div className='mark-attendance'>
            <Navbar />
            <div className="mark-attendance-container">
            <div className="classes-button">
              {
                  classes?.map((cl, index) => (
                      <button key={index} onClick={() => handleClick(cl)}>{cl.name}</button>
                  ))
              }
            </div>
            {sclass ? 
                (
                    <>
                    <h1>Class: {className}</h1>

                    <div className="attendance-date-picker">
                        <label>Select a Date</label>
                        <DatePicker
                          class="date-picker"
                          placeholderText="Choose Date"
                          style={{ marginRight: "10px" }}
                          selected={adate}
                          onChange={(adate) => setAdate(adate)}
                        />
                    </div>
        
        
                    <div className="attendance-marking-table">
                      <div className="attendance-row" id='title-row'>
                          <div className="attendance-col">Enrollment Number</div>
                          <div className="attendance-col">Student</div>
                          <div className="attendance-col">Present</div>
                      </div>
          
                      {stuData?.students?.map((st, index) => (
                          <div className="attendance-row" key={index}>
                              <div className="attendance-col">{st.enroll}</div>
                              <div className="attendance-col">{st.name}</div>
                              <div className="attendance-col">
                                  <input type="checkbox" name="attendance" id="attendance" 
                                      checked={presentStudents.includes(st._id)}
                                      onChange={() => handleCheckboxChange(st._id)}
                                  />
                              </div>
                          </div>
                      ))}
                    </div>
        
                    
                    <div className="mark-attendance-button">
                        <button onClick={handleSubmit}>Mark Attendance</button>
                    </div>
                    </>
                ) : (
                    <>
                    <h1>Please select a class</h1>
                    </>
                )
            }


            </div>
        </div>
    )
}

export default MarkAttendance