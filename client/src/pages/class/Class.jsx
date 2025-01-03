import React from 'react'
import "./class.scss"
import { Link } from 'react-router-dom';
import useFetch from '../../config/service/useFetch';
import { getClasses } from '../../config/endpoints/get';

const Class = () => {

    const classes = useFetch(getClasses).data;
    classes.sort((a, b) => a.classNumber - b.classNumber)


  return (
    <div className='classes'>
        <div className="wholeContainer">
            <h1>Classes</h1>
            <div className="classesContainer">
                {
                    classes?.map((cl, index) => (
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
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Class