import React from 'react'
import "./viewStudents.scss"
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../config/context/AuthContext';
import axios from 'axios';
import useFetch from '../../config/hooks/useFetch';
import Navbar from '../../components/navbar/Navbar';
import StudentClass from '../../components/table/StudentClass'
import { getFacultyData } from '../../source/endpoints/get';


const ViewStudents = () => {
  const { user } = useContext(AuthContext)
  const classes = useFetch(getFacultyData(user._id, "classes")).data
  const [sclass, setSclass] = useState("");
  const [className, setClassName] = useState("");
  const [stuData, setStuData] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      if (sclass) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/students/${sclass}`);
          setStuData(response.data);
        } catch (error) {
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

      <Navbar />
      <div className="view-students-container">
        {
          classes?.map((cl, index) => (
            <button key={index} onClick={() => handleClick(cl)}>{cl.name}</button>
          ))
        }
        {sclass ? 
          (
            <>
              <h1>Students</h1>
              <h1>Class: {className}</h1>
            </>
          ) : (
            <>
              <h1>Please select a class</h1>
            </>
          )
        }
        {sclass && <StudentClass props={stuData.students} />}
      </div>
    </div>
  )
}

export default ViewStudents