import React from 'react'
import "./studentHome.scss"
import { useEffect, useState } from 'react'
import { useAuth } from '../../config/context/AuthContext'
import useFetch from '../../config/service/useFetch'
import { getTableURL } from '../../config/endpoints/get'
import axios from 'axios'

const StudentHome = () => {
  const [presenceDates, setPresenceDates] = useState([]);
  const [absenceDates, setAbsenceDates] = useState([]);
  const {user} = useAuth();
  const { data } = useFetch(getTableURL(user));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presenceResponse, absenceResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/attendances/presentdates/${user._id}/${user.class}`),
          axios.get(`${process.env.REACT_APP_API_URL}/attendances/absentdates/${user._id}/${user.class}`)
        ]);

        setPresenceDates(presenceResponse.data.presenceDates.map(date => new Date(date)));
        setAbsenceDates(absenceResponse.data.absenceDates.map(date => new Date(date)));
      } catch (error) {
        console.error("Error fetching attendance data", error);
      } finally {
      }
    };

    fetchData();
  }, [user]);
 
  return (
    <div className='student-home'>
        <div className="student-home-container">
            <div className="welcome">
                <img src="/Assets/brand.png" alt="" />
                <div className="text">
                    <h1>Welcome to Edu-Sangam</h1>
                    <p>Providing seamless navigation for your learning via our portal</p>
                </div>
            </div>
            
            <div className="middleContainer">
                <div className="notifications-container">
                    <h2>Latest Updates</h2>
                    {data?.map((d, i) => (
                        <div className="notification" key={i}>
                            <div className="title">
                                {d.title}
                            </div>
                            <div className="description">
                                {d.desc}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="attendance-status">

                </div>
            </div>
        </div>
    </div>
  )
}

export default StudentHome