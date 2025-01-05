import React from 'react'
import './viewClass.scss'
import useFetch from '../../config/service/useFetch'
import { useLocation } from 'react-router-dom'
import Course from '../../components/course/Course'
import { getClassDetails } from '../../config/endpoints/get'
import GenericTable from '../../components/table/Table'
import { studentColumns } from '../../config/tableSource/studentsColumns'
import { ClipLoader } from 'react-spinners'

const ViewClass = () => {

    const location = useLocation();
    const id = location.pathname.split("/")[3]

    const {data, loading} = useFetch(getClassDetails(id))

  return (
    <div className='viewClass'>
        {loading ? (
          <div className="page-loader">
            <ClipLoader color="black" size={50} />
            <h3>Loading data...</h3>
          </div>
        ) : (<div className="viewClassContainer">
                <h2>{data.name} Standard</h2>

                <div className="top">
                {
                    data?.subjects?.length > 0? (
                        <>
                        {data?.subjects?.map((item, index) => (
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
                    {data?.students?.length > 0 ? (<GenericTable columns={studentColumns} rows={data.students} rowKey='id' />) : (<div>No students in class at the moment</div>)}
                </div>
            
        </div>)}
    </div>
  )
}

export default ViewClass