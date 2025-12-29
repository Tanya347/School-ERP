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
import EventCalender from "../../components/calender/Calender";
import Loader from "../../components/loader/Loader.jsx";
import ConfirmPopup from "../../components/popUps/ConfirmatinPopup.jsx";

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
          toast.error(
            <div>
              <strong>Session Fetch Failed</strong>
              <div>{err.response?.data?.message || err.message || 'Unknown error'}</div>
            </div>
          );
          console.error("Error fetching session data:", err)
        }
      }
    }
    fetchSession()
  }, [user, user.schoolID]);
  const { data: genderCount, error: genderCountError } = useFetch(schoolGenderCount);

  if (genderCountError) {
    toast.error(
      <div>
        <strong>Gender Count Fetch Failed</strong>
        <div>{genderCountError.response?.data?.message || genderCountError.message || 'Unknown error'}</div>
      </div>
    );
  }

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
