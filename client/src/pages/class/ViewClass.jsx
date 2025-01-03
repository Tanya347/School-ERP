import React from 'react'
import './viewClass.scss'
import useFetch from '../../config/service/useFetch'
import { useLocation } from 'react-router-dom'
import Course from '../../components/course/Course'
import { getClassDetails } from '../../config/endpoints/get'
import GenericTable from '../../components/table/Table'

const ViewClass = () => {

    const location = useLocation();
    const id = location.pathname.split("/")[3]

    const classData = useFetch(getClassDetails(id)).data

    const columns = [
        {
          field: "name",
          label: "Name",
          render: (value, row) => (
            <div className="cellWrapper">
              <img
                src={row.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
                alt="avatar"
                className="image"
              />
              {value}
            </div>
          ),
        },
        { field: "enroll", label: "Enrollment Number" },
        { field: "gender", label: "Gender" },
        { field: "email", label: "Email" },
        { field: "studentPhone", label: "Phone" },
    ];

  return (
    <div className='viewClass'>
        <div className="viewClassContainer">
                <h2>{classData.name} Standard</h2>

                <div className="top">
                {
                    classData?.subjects?.length > 0? (
                        <>
                        {classData?.subjects?.map((item, index) => (
                            <Course 
                            name={item?.name}
                            index={index}
                            subjectCode={item?.subjectCode}
                            syllabusPicture={item?.syllabusPicture} 
                            teacher={item?.teacher?.teachername}/>
                            ))}
                        </>
                    ) : (
                        <div>No subjects in class at the moment</div>
                    ) 
                }
                </div>
                <div className="bottom">
                    {classData?.students?.length > 0 ? (<GenericTable columns={columns} rows={classData.students} rowKey='id' />) : (<div>No students in class at the moment</div>)}
                </div>
            
        </div>
    </div>
  )
}

export default ViewClass