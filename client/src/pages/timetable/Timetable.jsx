import "./timetable.scss"

import { useState, useEffect, useMemo } from 'react'
import { useParams } from "react-router-dom";

import { periodTimes, days, periods, checkAdmin } from '../../utils/shared/commons';
import { getTimeTableURL } from '../../utils/endpoints/get';
import { useSelector } from "react-redux";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";

import Loader from "../../components/shared/loader/Loader"
import InlineError from "../../components/shared/inlineError/InlineError"

const Timetable = ({type}) => {
  
  const [existingSlots, setExistingSlots] = useState({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { classId } = useParams();

  const { user } = useSelector(state => state.auth);

  const id = useMemo(() => {
    if (type !== "class") return null;

    return checkAdmin(user.role)
      ? classId
      : user.classID;
  }, [type, user.role, user.classID, classId]);


  const fetchTimetable = async () => {
    if (!id && type !== "faculty") return;

    setLoading(true);
    setError(null);

    const timetableURL =
      type === "faculty"
        ? getTimeTableURL(user._id, "faculty")
        : getTimeTableURL(id, "class");

    try {
      const res = await axiosInterceptor.get(timetableURL);
      const slots = res.data.data;
      const mapped = {};

      slots.forEach((slot) => {
        const key = `${slot.day}_${slot.period}`;
        mapped[key] = {
          courseName: slot.courseID?.name || "—",
          facultyName: slot.facultyID?.teachername || "Not Assigned",
          className: slot.classID?.name || "",
        };
      });

      if (type === "class") {
        setTitle(slots[0]?.classID?.name + " Standard");
      } else {
        setTitle("My Timetable");
      }

      setExistingSlots(mapped);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTimetable();
  }, [id, type, user._id])

  return (
    <div className='timetable-container'>
      {loading ? (
        <Loader text="Loading data..." type="global"/>
      ) : error ? (
        <InlineError
          title="Error loading timetable"
          message={error.response?.data?.message || error.message}
          onRetry={fetchTimetable}
        />
      ) : (
        <>
          <h1>{title}</h1>
          <div>
            <table cellSpacing={10} className="table-container">
              <thead>
                <tr>
                  <th>Day / Period</th>
                  {periods.map(period =>
                      <th key={period}>
                        <div className='period-header' key={period}> Period {period}
                          <span className='period-time'>{`${periodTimes[period].start} - ${periodTimes[period].end}`}</span>
                        </div>
                      </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td className='period-day'>{day}</td>
                    {periods.map(period => (
                      <td key={`${day}_${period}`} 
                          className={`period-slot ${existingSlots[`${day}_${period}`]
                            ? "existing"
                            : ""}`}
                        >
                        <div>
                          {existingSlots[`${day}_${period}`] ? (
                            <div className="existing-slot">
                              <p>{existingSlots[`${day}_${period}`].courseName}</p>

                              {type === "class" && (
                                <span>({existingSlots[`${day}_${period}`].facultyName})</span>
                              )}

                              {type === "faculty" && (
                                <span>({existingSlots[`${day}_${period}`].className})</span>
                              )}
                            </div>
                          ) : (
                            <div className="free">-- free --</div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Timetable