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
// import { useParams, useNavigate } from "react-router-dom";

import { getAttendanceDates, getLectureCount } from "../../utils/endpoints/get"
import { getClearClassURL } from "../../utils/endpoints/delete";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { dateTimeFormat, locales } from "../../utils/shared/constants";
import { checkSuccess } from "../../utils/shared/commons";

import CustomToolbar from "../../utils/shared/CustomToolbar"
import AttendanceTable from "../../components/attendanceTable/AttendanceTable";
import InforBanner from "../../components/shared/infoBanner/InforBanner";

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const AttendanceInfo = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [dates, setDates] = useState([]);
    const [lectures, setLectures ]= useState(0);
    // const [className, setClassName] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [viewDate, setViewDate] = useState('');
    const [attId, setAttId] = useState('');

    const { user } = useSelector(state => state.auth);

    // const { classId } = useParams();
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (classId) {
    //         setSclass(classId);

    //         const cl = classes?.find(c => c._id === classId);
    //         if (cl) setClassName(cl.name);
    //     }
    // }, [classId, classes]);

  
    useEffect(() => {

        const fetchLectures = async() => {
            if(user?.classTeacherTo) {
                try {
                    const response = await axiosInterceptor.get(`${getLectureCount}/${user?.classTeacherTo}`)
                    setLectures(response.data.data);
                } catch(error) {
                    toast.error(
                        <div>
                            <strong>Error fetching no. of lectures</strong>
                            <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
                        </div>
                    );
                    console.log("Error fetching no. of lectures", error);
                }
            }
        }

        fetchLectures();
    }, [user?.classTeacherTo, refreshTrigger])

    useEffect(() => {
        const fetchDates = async() => {
            if(user?.classTeacherTo) {
                try {
                    const response = await axiosInterceptor.get(`${getAttendanceDates}/${user?.classTeacherTo}`)
                    const event = response?.data.data?.map((a) => {
                        const d = new Date(a.date)
                        return {id: a.id, title: `${a.presentCount} Pres. ${a.absentCount} Abs.`, start: d}
                    })
                    setDates(event)
                } catch(error) {
                    toast.error(
                        <div>
                            <strong>Error fetching attendance dates</strong>
                            <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
                        </div>
                    );
                    console.log("Error fetching attendance dates", error);
                }
            }
        }

        fetchDates();
    }, [user?.classTeacherTo, refreshTrigger])

  const handleEventPopup = (e) => {
    setAttId(e.id)
    const formattedDate = moment(e.start).format(dateTimeFormat);
    setViewDate(formattedDate);
    setOpenModal(true);
  }

    const handleClear = async() => {
    // this deletes data from the database
        try {
            const res = await axiosInterceptor.delete(getClearClassURL(user?.classTeacherTo));
            if(checkSuccess(res.data.status)) {
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
            {user?.classTeacherTo ? (
                <>
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

                        <Link to={`/faculty/classes/attendance/${user?.classTeacherTo}`} >
                            <div className="view-percentage">
                                <button>View Percentage Status</button>
                            </div>
                        </Link>
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
            )}
        </div>
        {openModal && <AttendanceTable setOpen={setOpenModal} classid={user?.classTeacherTo} date={viewDate} id={attId} refreshTrigger={setRefreshTrigger}/>}

    </div>
  )
}

export default AttendanceInfo