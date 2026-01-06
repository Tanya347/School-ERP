import "./studentHome.scss"

import { CircularProgressbar } from "react-circular-progressbar";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

import { getSingleData, getStudentAttendance } from "../../config/endpoints/get"
import useFetch from "../../config/service/useFetch"
import axiosInterceptor from "../../config/utils/axiosInterceptor";

import SchoolInfo from "../../components/schoolInfo/SchoolInfo"
import EventCalender from "../../components/calender/Calender"
import Lecture from "../../components/lecture/Lecture"
import StudentProfile from "../../components/profile/StudentProfile"
import Course from "../../components/course/Course"
import Loader from "../../components/shared/loader/Loader"

const StudentHome = () => {

  const [attendance, setAttendance] = useState({})
  
  const { user } = useSelector(state => state.auth);
  const { data, loading } = useFetch(getSingleData(user._id, "students"))
 
  useEffect(() => {
    const fetchAttendance = async () => {
      if(data?.classInfo?._id) {
        try {
          const response = await axiosInterceptor.get(getStudentAttendance(data?._id, data?.classInfo._id))
          setAttendance(response.data.data)
        }
        catch(err) {
          console.log(err)
        }
      }
    }

    fetchAttendance();
  }, [data])

  return (
    <div className='student-home-container'>
      <div className="main-container">
        <div className="left-container">
          <SchoolInfo schoolID={user.schoolID} />
          <div className="bottom-container">
            <EventCalender />
            <div className="student-courses-container">
              <h2 className="course-title">Courses</h2>
              {
                loading ? (
                  <Loader text="fetching courses..."/>
                ) : (
                  <div className="courses-container">
                    {data?.classInfo?.subjects?.map((item, index) => (
                      <Course
                        name={item?.name}
                        index={index}
                        subjectCode={item?.subjectCode}
                        syllabusPicture={item?.syllabusPicture} 
                        teacher={item?.teacher?.teachername}
                      />
                    ))}
                  </div>
                )
              }
          
            </div>
            <div className="attendance-container">
              {Object.keys(attendance).length > 0  && <div className="attendance">
                <h2 className="title">Attendance</h2>
                <CircularProgressbar value={parseFloat(attendance?.attendancePercentage?.toFixed(2))} text={`${attendance?.attendancePercentage?.toFixed(2)}%`} strokeWidth={10} className="progressbar" />
                <div><span>Classes Attended:</span> {attendance?.attendedLectures}</div>
                <div><span>Total Classes:</span> {attendance?.totalLectures}</div>
              </div>}
            </div>
          </div>
        </div>
         <div className="right-container">
          <StudentProfile data={data}/>
          <Lecture id={user?.class} type={user?.role} />
        </div>
      </div>
    </div>
  )
}

export default StudentHome