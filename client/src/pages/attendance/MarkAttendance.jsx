import "./markAttendance.scss"

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { useSelector } from "react-redux";

import { getAttendanceStatusByDate, getStudentsOfClass } from '../../utils/endpoints/get'
import { postURLs } from '../../utils/endpoints/post'
import { createElement } from '../../utils/service/usePost'
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { dateTimeFormat } from "../../utils/shared/constants";

import InforBanner from '../../components/shared/infoBanner/InforBanner'
import { toast } from "react-toastify";

const MarkAttendance = () => {

    const [stuData, setStuData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [sdate, setSdate] = useState(new Date());
    const [presentStudents, setPresentStudents] = useState([]);

    const navigate = useNavigate();
    
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchStudents = async () => {
          if (user?.classTeacherTo) {
            try {
              const response = await axiosInterceptor.get(getStudentsOfClass(user?.classTeacherTo));
              setStuData(response.data.data);
            } catch (error) {
              toast.error(
                <div>
                  <strong>Error fetching student data</strong>
                  <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
                </div>
              );
              console.error("Error fetching student data:", error);
            }
          }
        };
        fetchStudents();
      }, [user?.classTeacherTo])
    
      useEffect(() => {
        const fetchDates = async() => {
        if(user?.classTeacherTo && sdate) {
            try {
                const formattedDate = moment(sdate).format(dateTimeFormat);
                const response = await axiosInterceptor.get(`${getAttendanceStatusByDate(user?.classTeacherTo, formattedDate)}`)
                
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
                toast.error(
                  <div>
                    <strong>Error fetching attendance dates</strong>
                    <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
                  </div>
                );
                console.log("Error fetching attendance dates", error);
                setEditMode(false);
                setPresentStudents([]);
            }
          }
        }

        fetchDates();
      }, [user?.classTeacherTo, sdate])

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
                classID: user?.classTeacherTo,
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
            {user?.classTeacherTo ? 
                (
                    <>
                    <div className="attendance-header">
                      <div className="attendance-date-picker">
                          <DatePicker
                            class="date-picker"
                            placeholderText="Choose Date"
                            style={{ marginRight: "10px" }}
                            selected={sdate}
                            onChange={(sdate) => setSdate(sdate)}
                            maxDate={new Date()}
                          />
                      </div>
                    </div>
        
        
                    <div className="attendance-marking-table">
                      <div className="attendance-row" id='title-row'>
                          <div className="attendance-col">Enrollment Number</div>
                          <div className="attendance-col">Student</div>
                          <div className="attendance-col">Present</div>
                      </div>
          
                      {stuData?.map((st, index) => (
                          <div className="attendance-row" key={index}>
                              <div className="attendance-col">{st?.enroll}</div>
                              <div className="attendance-col">{st?.name}</div>
                              <div className="attendance-col">
                                  <input type="checkbox" name="attendance" id="attendance"
                                      checked={presentStudents.includes(st?._id)}
                                      onChange={() => handleCheckboxChange(st?._id)}
                                  />
                              </div>
                          </div>
                      ))}
                    </div>
        
                    
                    <div className="mark-attendance-button">
                        <button onClick={handleSubmit}>{editMode ? "Update Attendance" : "Mark Attendance"}</button>
                    </div>
                    </>
                ) : (
                    <>
                      <InforBanner
                        type="info"
                        header="No Class Assigned"
                        description="You are not assigned as a class teacher to any class."
                      ></InforBanner>
                    </>
                )
            }


            </div>
        </div>
    )
}

export default MarkAttendance