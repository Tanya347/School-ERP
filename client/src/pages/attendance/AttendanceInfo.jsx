import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import CustomToolbar from "../../components/utils/CustomToolbar"


import axios from "axios"
import { useAuth } from "../../config/context/AuthContext"
import useFetch from "../../config/service/useFetch"
import { getAttendanceDates, getFacultyData, getLectureCount } from "../../config/endpoints/get"
import "./attendanceInfo.scss"

import React, { useEffect, useState } from 'react'
import AttendanceTable from "../../components/popUps/AttendanceTable";
import { getClearClassURL } from "../../config/endpoints/delete";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const AttendanceInfo = () => {
  const { user } = useAuth();
  const [sclass, setSclass] = useState("");
  const [className, setClassName] = useState("");
  const [dates, setDates] = useState([]);
  const [lectures, setLectures ]= useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [viewDate, setViewDate] = useState('');
  const [attId, setAttId] = useState('');

  const classes = useFetch(getFacultyData(user._id, "classes")).data
  
  useEffect(() => {

      const fetchLectures = async() => {
        if(sclass) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}${getLectureCount}/${sclass}`)
                setLectures(response.data.data);
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
                const event = response?.data.data?.map((a) => {
                    const d = new Date(a.date)
                    return {id: a.id, title: `${a.presentCount} Pres. ${a.absentCount} Abs.`, start: d}
                })
                setDates(event)
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

  const handleEventPopup = (e) => {
    setAttId(e.id)
    const formattedDate = moment(e.start).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    setViewDate(formattedDate);
    setOpenModal(true);
  }

  const handleClear = async() => {
    // this deletes data from the database
    try {
        const res = await axios.delete(getClearClassURL(sclass), { withCredentials: true });
        if(res.data.status === 'success') {
            toast.success("Attendance has been cleared!");
        }
        // this filters the array by filtering out the deleted element based on the id
        setDates([]);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to clear attendance. Please try again.";
        toast.error(errorMessage);
        console.error(err);
        return err;
      }
  }


  return (
    <div className="attendance-info">
        <div className="attendance-info-container">
            <div className="classes-button">
                {
                    classes?.map((cl, index) => (
                        <button key={index} onClick={() => handleClick(cl)}>{cl.name}</button>
                    ))
                }
            </div>
            {sclass ? (
                <>
                    <h1>Class: {className}</h1>
                    <h1>Total No. of Lectures: {lectures}</h1>

                    <div className="attendance-dates-calender">
                        <Calendar
                            localizer={localizer}
                            events={dates}
                            startAccessor="start"
                            endAccessor="start"
                            style={{height: 500, margin: "50px"}}
                            onSelectEvent={handleEventPopup}
                            components={{
                                toolbar: CustomToolbar
                              }}
                        />
                    </div>

                    <div className="button-container">
                        <div className="clear-attendance">
                            <button onClick={handleClear}>Clear Class Attendance</button>
                        </div>

                        <Link to={`/faculty/classes/attendance/${sclass}`} >
                            <div className="view-percentage">
                                <button>View Percentage Status</button>
                            </div>
                        </Link>
                    </div>
                </>
            ) : (
              <>
                <h1>Please select a class</h1>
              </>
            )}
        </div>
        {openModal && <AttendanceTable setOpen={setOpenModal} classid={sclass} date={viewDate} id={attId}/>}

    </div>
  )
}

export default AttendanceInfo