import React from 'react'
import './viewClass.scss'
import AdminNavbar from '../../components/adminNavbar/AdminNavbar'
import useFetch from '../../hooks/useFetch'
import { useLocation } from 'react-router-dom'
import Course from '../../components/course/Course'
import StudentClass from '../../components/studentClass/StudentClass'

const ViewClass = () => {

    const location = useLocation();
    const id = location.pathname.split("/")[3]

    const classData = useFetch(`/classes/${id}`).data

  return (
    <div className='viewClass'>
        <AdminNavbar />
        <div className="viewClassContainer">
                <h2>{classData.name} Standard</h2>
                <div className="top">
                {
                    classData.subjects? (
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
                    {classData.students? (<StudentClass props = {classData.students} />) : (<div>No students in class at the moment</div>)}
                </div>
            
        </div>
    </div>
  )
}

export default ViewClass