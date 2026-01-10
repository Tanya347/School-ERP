import './lecture.scss'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import useFetch from '../../utils/service/useFetch';
import { getLectures } from '../../utils/endpoints/get';
import { todayDay } from "../../utils/shared/constants";

import Loader from '../shared/loader/Loader';

const Lecture = ({id, type}) => {

  const { data: slots, loading} = useFetch(getLectures(id, type));

  const lectures = Array.isArray(slots)
    ? slots
        .filter(slot => slot.day === todayDay)
        .map(slot => ({
          class: slot.classID?.name || '',
          course: slot.courseID?.name || '',
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
    : [];

  return (
    <div className='lecture-component'>
        {!loading ? (<><h2>Today's Lectures</h2>
        <div className="lecture-header">
          <span className='today-date'>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="horizontal-line"></span>
          <MoreHorizIcon className='more-icon' />
        </div>
        <div className="lecture-container">
          {
            lectures.length > 0 ? (
              <>
                {
                  lectures?.map((item, ind) => (
                    <div className="lecture" key={ind}>
                      <div className='lecture-time-range'><span>{item.startTime} - {item.endTime} AM</span></div>
                      <div className="lecture-info">
                        <span className='lecture-course'>{item.course}</span>
                        <span className='lecture-class'>Class: {item.class}</span>
                      </div>
                    </div>
                  ))
                }
              </>
            ) : (
              <div className='no-lectures'>
                No lectures today
              </div>
            )
          }
        </div></>) : (<Loader text="Loading lectures..." type="global"/>)}
    </div>
  )
}

export default Lecture