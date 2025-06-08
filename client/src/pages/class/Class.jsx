import React from 'react'
import "./class.scss"
import { Link } from 'react-router-dom';
import useFetch from '../../config/service/useFetch';
import { getClasses } from '../../config/endpoints/get';
import { ClipLoader } from 'react-spinners';

const Class = () => {

    const {data, loading} = useFetch(getClasses);


  return (
    <div className='classes'>
        {loading ? (
            <div className="page-loader">
            <ClipLoader color="black" size={50} />
            <h3>Loading data...</h3>
          </div>
        ) : (<div className="wholeContainer">
            <h1>Classes</h1>
            <div className="classesContainer">
                {
                    data?.map((cl, index) => (
                        <div className="classContainer" key={index}>
                            <h3>{cl.name} Standard</h3>
                            <Link to={`/admin/classes/${cl._id}`}>
                                <button className='viewButton'>View</button>
                            </Link>
                            <Link to={`/admin/classes/attendance/${cl._id}`}>
                                <button className='attButton'>Attendance Status</button>
                            </Link>
                            <Link to={`/admin/classes/marks/${cl._id}`}>
                                <button className='marksButton'>Marks Status</button>
                            </Link>
                            <Link to={`/admin/timetables/${cl._id}`}>
                                <button className='ttButton'>Timetable</button>
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