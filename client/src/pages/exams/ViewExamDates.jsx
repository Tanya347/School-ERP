import { useEffect, useState } from 'react'
import './viewExamDates.scss'
import { useAuth } from '../../config/context/AuthContext';
import axios from 'axios';

const ViewExamDates = () => {
  const {user} = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if(user) {
        try {
          const response = await axios.get(process.env.REACT_APP_API_URL + `/courses/exam/${user.sclass}`, {withCredentials: true});
          if(response.data.status === "success") {
            setData(response.data.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchData();
  }, [user]);

  return (
    <div className='view-exam-dates-container'>
      <h2 className="listTitle">Exam Dates</h2>
      <div className="exam-dates-list">
        {Object.entries(data).length > 0 ? (
          Object.entries(data).map(([courseId, examDate]) => (
            <div key={courseId} className="exam-date-item">
              <span className="course-id">{courseId}</span>
              <span className="exam-date">{new Date(examDate).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>No exam dates available.</p>
        )}
      </div>
    </div>
  )
}

export default ViewExamDates