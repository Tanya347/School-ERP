import "./adminHome.scss";

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";

import useFetch from "../../utils/service/useFetch.js";
import { schoolGenderCount } from "../../utils/endpoints/get.js";
import { postURLs } from "../../utils/endpoints/post.js";
import axiosInterceptor from "../../utils/shared/axiosInterceptor.js";
import { sessionsConst } from "../../utils/shared/constants.js";
import { checkSuccess } from "../../utils/shared/commons.js";

import { MyPieChart } from "../../components/shared/graphs/PieChart";
import SchoolInfo from "../../components/schoolInfo/SchoolInfo";
import AdminWidgets from "../../components/adminWidgets/AdminWidgets.jsx";
import EventCalender from "../../components/calender/Calender";
import Loader from "../../components/shared/loader/Loader.jsx";
import ConfirmPopup from "../../components/shared/confirmationPopup/ConfirmatinPopup.jsx";

// type specifies the admin side or user side 
const AdminHome = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  
  const { activeSession } = useSelector(state => state.school);

  const { data: genderCount } = useFetch(schoolGenderCount);

  const handleClick = async (e) => {
    setConfirmMessage(`Are you sure you want to start a new session?`);
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        const res = await axiosInterceptor.post(postURLs(sessionsConst, "normal"), {});
        if(checkSuccess(res.data.status)) {
          toast.success(`session started successfully!`);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || `Failed to start the session. Please try again.`;
        toast.error(errorMessage);
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
      <div className="admin-home-container">

        <div className="main-container">
            <SchoolInfo />
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
              <h3>{activeSession?.name}</h3>
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
