import axios from "axios"
import { AuthContext } from "../../config/context/AuthContext"
import useFetch from "../../config/hooks/useFetch"
import { getAttendanceDates, getFacultyData, getLectureCount } from "../../source/endpoints/get"
import "./attendanceInfo.scss"

import React, { useContext, useEffect, useState } from 'react'
import Navbar from "../../components/navbar/Navbar"

const AttendanceInfo = () => {
  const { user } = useContext(AuthContext)
  const [sclass, setSclass] = useState("");
  const [className, setClassName] = useState("");
  const [dates, setDates] = useState([]);
  const [lectures, setLectures ]= useState(0);

  const classes = useFetch(getFacultyData(user._id, "classes")).data
  
  useEffect(() => {

      const fetchLectures = async() => {
        if(sclass) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}${getLectureCount}/${sclass}`)
                setLectures(response.data);
            } catch(error) {
                console.log("Error fetching no. of lectures", error);
            }
          }
      }

      fetchLectures();
  }, [sclass])

  useEffect(() => {
    const fetchDates = async() => {
        if(sclass) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}${getAttendanceDates}/${sclass}`)
                setDates(response.data)
            } catch(error) {
                console.log("Error fetching attendance dates", error);
            }
        }
      }

      fetchDates();
  }, [sclass])

  const handleClick = (cl) => {
    setSclass(cl._id);
    setClassName(cl.name);
  };

  console.log(dates)

  return (
    <div className="attendance-info">
        <Navbar />
        <div className="attendance-info-container">
            {
            classes?.map((cl, index) => (
                <button key={index} onClick={() => handleClick(cl)}>{cl.name}</button>
            ))
            }
            {sclass ? (
                <>
                    <h1>Class: {className}</h1>
                    <h1>Total No. of Lectures: {lectures.lectureCount}</h1>

                    <div className="attendance-dates-table">
                        <h2>Lecture Dates</h2>
                        {dates?.map((d, index) => (
                            <div key={index} className="attendance-date">
                                <p className="">{new Date(d.date).toLocaleDateString()}</p>
                                <p>Present: {d.presentCount}</p>
                                <p>Absent: {d.absentCount}</p>
                                <button className="View-attendance">View</button>
                            </div>
                        ))}
                    </div>
                    {/* fetch dates with marked attendances 
                        -- view particular day
                           -- edit student attendance on a particular day
                        -- clear attendance on a particular day
                        -- clear all attendance
                    
                        -- get attendance of students percentage
                    */}

                </>
            ) : (
              <>
                <h1>Please select a class</h1>
              </>
            )}
        </div>
    </div>
  )
}

export default AttendanceInfo