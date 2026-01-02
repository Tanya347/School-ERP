import './addClass.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {toast} from "react-toastify"

import useFetch from '../../config/service/useFetch';
import { getCourseClasses } from '../../config/endpoints/get';

import Dropdown from '../shared/dropdown/Dropdown';
import Popup from '../shared/popup/Popup';

const AddClass = ({ setOpen, facId }) => {

    const [sclass, setSclass] = useState("");
    const [classIndex, setClassIndex] = useState();
    const [course, setCourse] = useState("");

    const navigate = useNavigate();

    const classes = useFetch(getCourseClasses).data;

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
                            options={classes}
                            onChange={(e) => {
                                setSclass(e.target.value);
                                setClassIndex(e.target.selectedIndex - 1);
                            }}
                            value={sclass}
                        />
                        {sclass && <Dropdown
                                title="Select Course"
                                options={classes[classIndex]?.subjects}
                                onChange={(e) => setCourse(e.target.value)}
                                value={course}
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