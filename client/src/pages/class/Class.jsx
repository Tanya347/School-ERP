import React from 'react'
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import "./class.scss"
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const Class = () => {

    const classes = useFetch('/classes').data;
    classes.sort((a, b) => a.classNumber - b.classNumber)


  return (
    <div className='classes'>
            <AdminNavbar />
        <div className="wholeContainer">
            <h1>Classes</h1>
            <div className="classesContainer">
                {
                    classes.map((cl, index) => (
                        <div className="classContainer" key={index}>
                            <h3>{cl.name} Standard</h3>
                            <button className='courseButton'>Add Course</button>
                            <button className='studentButton'>Add Student</button>
                            <Link to={`/admin/classes/${cl._id}`}>
                                <button className='viewButton'>View</button>
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