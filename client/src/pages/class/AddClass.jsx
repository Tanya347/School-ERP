import React, { useState } from 'react'
import './addClass.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import useFetch from '../../config/service/useFetch';
import axios from 'axios';
import { getCourseClasses } from '../../config/endpoints/get';
import {toast} from "react-toastify"

const AddClass = () => {

    const location = useLocation();
    const classes = useFetch(getCourseClasses).data;
    const facId = location.pathname.split("/")[4]
    const [sclass, setSclass] = useState("");
    const [classIndex, setClassIndex] = useState();
    const [course, setCourse] = useState("");
    const navigate = useNavigate();

    const handleClick = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`${process.env.REACT_APP_API_URL}/faculties/addCourse/${facId}/${sclass}/${course}`, {
                withCredentials: true
              })

            if(res.data.status === 'success') {
                toast.success("Course assigned to faculty successfully!");
                navigate(`/admin/faculties/single/${facId}`)
            }

        }
        catch(err) {
            console.log(err)
        }
    }
    
  return (
    <div className='addClassPage'>
        <div className="addClassContainer">
            <form>
                <div className="formInput">
                    <label>Select Class</label>
                    <select onChange={(e) => {
                                setSclass(e.target.value);
                                setClassIndex(e.target.selectedIndex - 1); // Subtract 1 to account for the placeholder option
                            }} id="classId">
                        <option>-</option>
                        {classes?.map((cl, index) => (
                            <option value={cl._id} key={index}>{cl.name}</option>
                        ))}
                    </select>
                </div>

                {
                    sclass && 
                        <div className="formInput">
                            <label>Select Course</label>
                            <select onChange={(e) => setCourse(e.target.value)} id="courseId">
                                <option>-</option>
                                {
                                    classes[classIndex]?.subjects.map((sb, index) => (
                                        <option value={sb._id} key={index}>{sb.name}</option>
                                    ))      
                                }
                            </select>
                        </div>
                }

                <button className='addCourseButton' onClick={handleClick}>Add Course</button>
            </form>
        </div>
    </div>
  )
}

export default AddClass