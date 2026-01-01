import { useEffect, useState } from 'react'
import "./markAttendance.scss"
import { useAuth } from '../../config/context/AuthContext'
import useFetch from '../../config/service/useFetch'
import { getAttendanceStatusByDate, getFacultyData } from '../../config/endpoints/get'
import axios from "axios";
import DatePicker from 'react-datepicker'
import { postURLs } from '../../config/endpoints/post'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { createElement } from '../../config/service/usePost'
import InforBanner from '../../components/shared/infoBanner/InforBanner'

const MarkAttendance = () => {

    const { user } = useAuth();
    const classes = useFetch(getFacultyData(user._id, "classes")).data
    const [sclass, setSclass] = useState("");
    const [stuData, setStuData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [sdate, setSdate] = useState(new Date());
    const [presentStudents, setPresentStudents] = useState([]);

    const navigate = useNavigate();
    let isClassTeacher = sclass?.classTeacher === user._id;;

    useEffect(() => {
        const fetchStudents = async () => {
          if (sclass) {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/students/${sclass._id}`);
              setStuData(response.data.data);
            } catch (error) {
              console.error("Error fetching student data:", error);
            }
          }
        };
        fetchStudents();
      }, [sclass])
    
      useEffect(() => {
        const fetchDates = async() => {
        if(sclass && sdate) {
            try {
                const formattedDate = moment(sdate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}${getAttendanceStatusByDate(sclass._id, formattedDate)}`)
                
                const attData = response.data.data;

                if (attData && attData.length > 0) {
                  setEditMode(true);
                  const present = attData
                    .filter((a) => a.status === "present")
                    .map((a) => a._id);
                  setPresentStudents(present);
                } else {
                  setEditMode(false);
                  setPresentStudents([]);
                }
            } catch(error) {
                console.log("Error fetching attendance dates", error);
                setEditMode(false);
                setPresentStudents([]);
            }
          }
        }

        fetchDates();
      }, [sclass, sdate])

      const handleClick = (cl) => {
        setSclass(cl);
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
                date: sdate,
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
        <h1>Mark Attendance</h1>
        <p>Manage and track student attendance records</p>
            <div className="mark-attendance-container">
            <div className="classes-button">
              {
                  classes?.map((cl, index) => (
                    <button  
                      className={sclass && sclass._id === cl._id ? 'selected-class' : ''}
                      key={index} onClick={() => handleClick(cl)}>
                        Class {cl.name}
                    </button>
                  ))
              }
            </div>
            {sclass ? 
                (
                    <>
                    <h1>Class: {sclass.name}</h1>
                    <div className="attendance-header">
                      {editMode && isClassTeacher && (
                        <div className="edit-mode-banner">
                          <InforBanner
                            type="info"
                            header="Edit Mode Activated"
                            description="Attendance for the selected date has already been marked. You can update the existing records."
                          ></InforBanner>
                        </div>
                      )}
                      {!isClassTeacher && (
                        <div className="not-authorized-banner">
                          <InforBanner
                            type="error"
                            header="Access Denied"
                            description="You are not authorized to mark attendance for this class."
                          ></InforBanner>
                        </div>
                      )}
                      {isClassTeacher && <div className="attendance-date-picker">
                          <DatePicker
                            class="date-picker"
                            placeholderText="Choose Date"
                            style={{ marginRight: "10px" }}
                            selected={sdate}
                            onChange={(sdate) => setSdate(sdate)}
                          />
                      </div>}
                    </div>
        
        
                    {isClassTeacher && <div className="attendance-marking-table">
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
                    </div>}
        
                    
                    {isClassTeacher && <div className="mark-attendance-button">
                        <button onClick={handleSubmit}>{editMode ? "Update Attendance" : "Mark Attendance"}</button>
                    </div>}
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