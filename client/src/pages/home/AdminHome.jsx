import "./adminHome.scss";

import AdminWidgets from "../../components/adminWidgets/AdminWidgets";
import useFetch from "../../config/service/useFetch";
import { getSession, schoolGenderCount } from "../../config/endpoints/get";
import { useAuth } from "../../config/context/AuthContext";
import SchoolInfo from "../../components/schoolInfo/SchoolInfo";
import { MyPieChart } from "../../components/graphs/PieChart";
import { useEffect, useState } from "react";
import axios from 'axios'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { postURLs } from "../../config/endpoints/post";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import EventCalender from "../../components/calender/Calender";

// type specifies the admin side or user side 
const AdminHome = () => {

  const {user} = useAuth();
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if(user) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}${getSession(user.schoolID)}`)
          setSessionName(response.data.data.name)
        } catch (err) {
          console.error("Error fetching session data:", err)
        }
      }
    }
    fetchSession()
  }, [user, user.schoolID]);
  const genderCount = useFetch(schoolGenderCount).data

  const handleClick = async (e) => {
    setLoading(true)
    try {
      const res = await axios.post(postURLs("sessions", "normal"), {}, {withCredentials: true});
      if(res.data.status === 'success') {
        toast.success(`session started successfully!`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to start the session. Please try again.`;
      toast.error(errorMessage);
      console.error(err);
      return err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home">
      {/* <Navbar /> */}
      <div className="AdminHomeContainer">
        {/* Navbar according to the type of user */}

        <div className="mainContainer">
            <SchoolInfo schoolID={user.schoolID} />
            <div className="widgets">
              <AdminWidgets />
            </div>
          <div className="bottom-container">
            <div className="pie-chart-container">
              <h3>Girls vs Boys Count</h3>
              <MyPieChart entryCounts={genderCount} showLegend={false}/>
            </div>
            <EventCalender />
            <div className="session-container">
              <AccessAlarmIcon className="icon"/>
              <h2>Session</h2>
              <h3>{sessionName}</h3>
              {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                  creating class...
                </div>}
              <button className="start-new-session" onClick={handleClick}>Start New Session</button>
            </div>
          </div>
        </div> 

      </div>
    </div>
  );
};

export default AdminHome;
