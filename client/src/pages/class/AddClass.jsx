import React, { useState } from 'react'
import './addClass.scss'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../config/service/useFetch';
import axios from 'axios';
import { getCourseClasses } from '../../config/endpoints/get';
import {toast} from "react-toastify"
import Dropdown from '../../components/dropdown/Dropdown';
import Popup from '../../components/popUps/Popup';

const AddClass = ({ setOpen, facId }) => {

    const classes = useFetch(getCourseClasses).data;
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
    <Popup 
        title= "Assign Course to Faculty"
        content={
            <div className="addClass">
                <form className='addClassContainer'>
                    <Dropdown 
                        title="Select Class"
                        url={getCourseClasses}
                        onChange={(e) => {
                            setSclass(e.target.value);
                            setClassIndex(e.target.selectedIndex - 1); // Subtract 1 to account for the placeholder option
                        }}
                    />
                    {sclass && <Dropdown
                            title="Select Course"
                            options={classes[classIndex]?.subjects}
                            onChange={(e) => setCourse(e.target.value)}
                        />
                    }
                </form>
            </div>
        }
        actions={[
            { label: 'Add Course', onClick: handleClick}
        ]}
        onClose={() => setOpen(false)}
    />
  )
}

export default AddClass