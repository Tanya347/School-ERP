import "./viewStudents.scss"

import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import { getClassDetails } from '../../utils/endpoints/get';
import { studentColumns } from '../../utils/tableSource/studentsColumns';
import axiosInterceptor from "../../utils/shared/axiosInterceptor";

import GenericTable from '../../components/shared/table/Table';
import { toast } from "react-toastify";


const ViewStudents = () => {
  
  const [sclass, setSclass] = useState("");
  const [className, setClassName] = useState("");
  const [stuData, setStuData] = useState({});

  const classes = useSelector(state => state.faculty.classes);

  useEffect(() => {
    const fetchStudents = async () => {
      if (sclass) {
        try {
          const response = await axiosInterceptor.get(getClassDetails(sclass));
          setStuData(response.data.data);
        } catch (error) {
          toast.error(
            <div>
              <strong>Error fetching students data</strong>
              <div>{error.response?.data?.message || error.message || 'Unknown error'}</div>
            </div>
          );
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudents();
  }, [sclass])

  const handleClick = (cl) => {
    setSclass(cl._id);
    setClassName(cl.name);
  };
  
  return (
    <div className='view-students'>
      <h1 className='student-title'>Students</h1>
      <div className="view-students-container">
        <div className="classes-button">
          {
            classes?.map((cl, index) => (
              <button
                key={index}
                onClick={() => handleClick(cl)}
                className={sclass === cl._id ? "selected-class" : ""}
              >{cl.name}</button>
            ))
          }
        </div>
        {sclass ? 
          (
            <>
              <h1>Class: {className}</h1>
            </>
          ) : (
            <>
              <h1>Please select a class</h1>
            </>
          )
        }
        <div className="studentlist-container">
          {sclass && stuData && stuData?.students && <GenericTable columns={studentColumns} rows={stuData.students} rowKey='id' />}
        </div>
      </div>
    </div>
  )
}

export default ViewStudents