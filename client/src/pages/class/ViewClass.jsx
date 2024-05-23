import React from 'react'
import './viewClass.scss'
import AdminNavbar from '../../components/navbar/AdminNavbar'
import useFetch from '../../config/hooks/useFetch'
import { useLocation } from 'react-router-dom'
import Course from '../../components/course/Course'
import StudentClass from '../../components/table/StudentClass'
import { getClassDetails } from '../../source/endpoints/get'

const ViewClass = () => {

    const location = useLocation();
    const id = location.pathname.split("/")[3]

    const classData = useFetch(getClassDetails(id)).data

  return (
    <div className='viewClass'>
        <AdminNavbar />
        <div className="viewClassContainer">
                <h2>{classData.name} Standard</h2>
                <div className="add-buttons">
                    <button className='courseButton'>Add Course</button>
                    <button className='studentButton'>Add Student</button>
                    <button className='facultyButton'>Add Faculty</button>
                </div>

                <div className="top">
                {
                    classData?.subjects?.length > 0? (
                        <>
                        {classData?.subjects?.map((item, index) => (
                            <Course 
                            name={item.name}
                            index={index}
                            subjectCode={item.subjectCode}
                            syllabusPicture={item.syllabusPicture} 
                            teacher={item.teacher.teachername}/>
                            ))}
                        </>
                    ) : (
                        <div>No subjects in class at the moment</div>
                    ) 
                }
                </div>
                <div className="bottom">
                    {classData?.students?.length > 0 ? (<StudentClass props = {classData.students} />) : (<div>No students in class at the moment</div>)}
                </div>
            
        </div>
    </div>
  )
}

export default ViewClass