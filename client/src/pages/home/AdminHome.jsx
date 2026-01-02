import "./adminHome.scss";

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

import { toast } from "react-toastify";
import axios from 'axios'
import { useEffect, useState } from "react";

import useFetch from "../../config/service/useFetch";
import { getSession, schoolGenderCount } from "../../config/endpoints/get";
import { useAuth } from "../../config/context/AuthContext";
import { postURLs } from "../../config/endpoints/post";

import { MyPieChart } from "../../components/shared/graphs/PieChart";
import SchoolInfo from "../../components/schoolInfo/SchoolInfo";
import AdminWidgets from "../../components/adminWidgets/AdminWidgets";
import EventCalender from "../../components/calender/Calender";
import Loader from "../../components/shared/loader/Loader.jsx";
import ConfirmPopup from "../../components/shared/confirmationPopup/ConfirmatinPopup.jsx";

// type specifies the admin side or user side 
const AdminHome = () => {

  const {user} = useAuth();
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

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
  const { data: genderCount } = useFetch(schoolGenderCount);

  const handleClick = async (e) => {
    setConfirmMessage(`Are you sure you want to start a new session?`);
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
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
        setShowConfirm(false);
      }
    })
    setShowConfirm(true);
  }

  return (
    <div className="home">
      <div className="AdminHomeContainer">

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
              {loading && <Loader text="Starting new session.."/>}
              <button className="start-new-session" onClick={handleClick}>Start New Session</button>
            </div>
          </div>
        </div> 

      </div>
      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default AdminHome;
