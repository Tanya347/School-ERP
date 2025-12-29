import { useState } from 'react'
import './viewClass.scss'
import useFetch from '../../config/service/useFetch'
import { useLocation } from 'react-router-dom'
import Course from '../../components/course/Course'
import { getClassDetails } from '../../config/endpoints/get'
import EditIcon from '@mui/icons-material/Edit';
import GenericTable from '../../components/table/Table'
import { studentColumns } from '../../config/tableSource/studentsColumns'
import AddClassTeacher from '../../components/popUps/AddClassTeacher'
import Loader from '../../components/loader/Loader'

const ViewClass = () => {
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();
    const id = location.pathname.split("/")[3]

    const {data, loading} = useFetch(getClassDetails(id))

  return (
    <div className='viewClass'>
        {loading ? (
          <Loader text="Loading class data..." />
        ) : (<div className="viewClassContainer">
                <h2>{data?.name} Standard</h2>
                {
                  data?.classTeacher ? (
                    <>
                    <div className='class-teacher-info'>
                      <h3>Class Teacher: <span>{data?.classTeacher?.teachername}</span></h3>
                      <EditIcon className='icon' onClick={() => setOpenModal(true)} />
                    </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setOpenModal(true)}
                        className='add-class-teacher'
                      >
                          Add Class Teacher
                      </button>
                    </>
                  )
                }
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
        {openModal && <AddClassTeacher setOpen={setOpenModal} sclass={id} teacherList={data?.teachers}/>}
    </div>
  )
}

export default ViewClass