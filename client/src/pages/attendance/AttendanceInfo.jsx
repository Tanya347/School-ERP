import "./attendanceInfo.scss"
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useEffect, useState } from 'react'
import moment from 'moment';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getAttendanceDates, getLectureCount } from "../../config/endpoints/get"
import { getClearClassURL } from "../../config/endpoints/delete";
import axiosInterceptor from "../../config/utils/axiosInterceptor";
import { successMsg, dateTimeFormat, locales } from "../../config/utils/constants";

import CustomToolbar from "../../config/utils/CustomToolbar"
import AttendanceTable from "../../components/attendanceTable/AttendanceTable";

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const AttendanceInfo = () => {
    
    const [sclass, setSclass] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [dates, setDates] = useState([]);
    const [lectures, setLectures ]= useState(0);
    const [className, setClassName] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [viewDate, setViewDate] = useState('');
    const [attId, setAttId] = useState('');

    const { classId } = useParams();
    const navigate = useNavigate();

    const classes = useSelector(state => state.faculty.classes);

    useEffect(() => {
        if (classId) {
            setSclass(classId);

            const cl = classes?.find(c => c._id === classId);
            if (cl) setClassName(cl.name);
        }
    }, [classId, classes]);

  
    useEffect(() => {

        const fetchLectures = async() => {
            if(sclass) {
                try {
                    const response = await axiosInterceptor.get(`${getLectureCount}/${sclass}`)
                    setLectures(response.data.data);
                } catch(error) {
                    console.log("Error fetching no. of lectures", error);
                }
            }
        }

        fetchLectures();
    }, [sclass, refreshTrigger])

    useEffect(() => {
        const fetchDates = async() => {
            if(sclass) {
                try {
                    const response = await axiosInterceptor.get(`${getAttendanceDates}/${sclass}`)
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
    }, [sclass, refreshTrigger])

  const handleEventPopup = (e) => {
    setAttId(e.id)
    const formattedDate = moment(e.start).format(dateTimeFormat);
    setViewDate(formattedDate);
    setOpenModal(true);
  }

    const handleClear = async() => {
    // this deletes data from the database
        try {
            const res = await axiosInterceptor.delete(getClearClassURL(sclass));
            if(res.data.status === successMsg) {
                toast.success("Attendance has been cleared!");
                setRefreshTrigger(prev => prev + 1);
            }
            // this filters the array by filtering out the deleted element based on the id
            setDates([]);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to clear attendance. Please try again.";
            toast.error(errorMessage);
            return err;
        }
    }

  return (
    <div className="attendance-info">
        <h1 className="attendance-title">Attendance</h1>
        <div className="attendance-info-container">
            <div className="classes-button">
                {
                    classes?.map((cl, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(`/faculty/attendance/${cl._id}`)}
                            className={sclass && sclass === cl._id ? 'selected-class' : ''}

                        >{cl.name}</button>
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