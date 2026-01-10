import "./timetable.scss"

import { useState, useEffect, useMemo } from 'react'
import { useLocation } from "react-router-dom";

import { periodTimes, days, periods, checkAdmin } from '../../utils/shared/commons';
import { getTimeTableURL } from '../../utils/endpoints/get';
import { useSelector } from "react-redux";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";

import Loader from "../../components/shared/loader/Loader"

const Timetable = ({type}) => {
  
  const [existingSlots, setExistingSlots] = useState({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const { user } = useSelector(state => state.auth);

  const id = useMemo(() => {
    if (type !== "class") return null;

    return checkAdmin(user.role)
      ? location.pathname.split("/").pop()
      : user.classID;
  }, [type, user.role, user.classID, location.pathname]);


  useEffect(() => {

    if (!id && type !== "faculty") return;

    let isMounted = true;
    setLoading(true);

    const timetableURL =
      type === "faculty"
        ? getTimeTableURL(user._id, "faculty")
        : getTimeTableURL(id, "class");

    axiosInterceptor
      .get(timetableURL)
      .then((res) => {
        if (!isMounted) return;
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
      })
      .catch(console.error)
      .finally(() =>isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [id, type, user._id])

  return (
    <div className='timetable-container'>
      {loading ? (
        <Loader text="Loading data..." type="global"/>
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