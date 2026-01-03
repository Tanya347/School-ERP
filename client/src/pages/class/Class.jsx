import "./class.scss"

import { Link } from 'react-router-dom';

import useFetch from '../../config/service/useFetch';
import { getClasses } from '../../config/endpoints/get';

import Loader from '../../components/shared/loader/Loader';

const Class = () => {

    const {data, loading} = useFetch(getClasses);

  return (
    <div className='classes'>
        {loading ? (
            <Loader text="Loading classes..." />
        ) : (<div className="whole-container">
            <h1>Classes</h1>
            <div className="classes-container">
                {
                    data?.map((cl, index) => (
                        <div className="class-container" key={index}>
                            <h3>{cl.name} Standard</h3>
                            <Link to={`/admin/classes/${cl._id}`}>
                                <button className='view-button'>View</button>
                            </Link>
                            <Link to={`/admin/classes/attendance/${cl._id}`}>
                                <button className='att-button'>Attendance Status</button>
                            </Link>
                            <Link to={`/admin/classes/marks/${cl._id}`}>
                                <button className='marks-button'>Marks Status</button>
                            </Link>
                            <Link to={`/admin/timetables/${cl._id}`}>
                                <button className='tt-button'>Timetable</button>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>)}
    </div>
  )
}

export default Class