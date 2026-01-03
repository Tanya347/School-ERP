import './addCourse.scss'

import CancelIcon from '@mui/icons-material/Cancel';

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {toast} from "react-toastify"

import useFetch from '../../config/service/useFetch.js';
import { getCourseClasses, getFacultyData } from '../../config/endpoints/get.js';
import { editCourse } from '../../config/endpoints/patch.js';
import { success } from "../../config/constants.js"

import Dropdown from '../shared/dropdown/Dropdown.jsx';
import Popup from '../shared/popup/Popup.jsx';
import Tooltip from "../shared/tooltip/Tooltip.jsx";

const AddCourse = ({ setOpen, facId }) => {

    const [sclass, setSclass] = useState("");
    const [classIndex, setClassIndex] = useState();
    const [course, setCourse] = useState("");
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);


    const navigate = useNavigate();

    const classes = useFetch(getCourseClasses).data;

    const handleClick = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(editCourse(facId, sclass, course, "addCourse"), {
                withCredentials: true
              })

            if(res.data.status === success) {
                toast.success("Course assigned to faculty successfully!");
                navigate(`/admin/faculties/single/${facId}`)
            }

        }
        catch(err) {
            const errorMessage = err.response?.data?.message || somethingWentWrongMsg;
            toast.error(errorMessage);
            console.log(err)
        }
    }

    const fetchAssignedCourses = useCallback(async () => {
        try {
            setLoadingCourses(true);
            const res = await axios.get(
            getFacultyData(facId, "courses"),
            { withCredentials: true }
            );
            setAssignedCourses(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch assigned courses");
        } finally {
            setLoadingCourses(false);
        }
    }, [facId]);


    useEffect(() => {
        fetchAssignedCourses();
    }, [fetchAssignedCourses]);

    const handleRemoveCourse = async (courseId, classId) => {
        try {
            await axios.patch(
            editCourse(facId, sclass, course, "removeCourse"),
            { withCredentials: true }
            );

            toast.success("Course removed successfully");
            fetchAssignedCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove course");
        }
    };

    
    return (
        <Popup 
            title= "Assign Course to Faculty"
            content={
                <div className="add-class">
                    <div className="assigned-courses">
                        <h4>Assigned Courses</h4>

                        {loadingCourses && <p>Loading...</p>}

                        {!loadingCourses && assignedCourses.length === 0 && (
                            <p className="empty">No courses assigned</p>
                        )}

                        {!loadingCourses && assignedCourses.map(course => (
                            <div key={course._id} className="assigned-course-item">
                            <div>
                                <strong>{course.name} </strong>
                                <span>
                                ({course.subjectCode})
                                </span>
                            </div>

                                <Tooltip content={"Remove course"} position="top">
                                    <CancelIcon
                                        className="remove-btn"
                                        onClick={() =>
                                            handleRemoveCourse(course._id, course.sclass)
                                        }
                                    />
                                </Tooltip>
                            </div>
                        ))}
                    </div>
                    <h4>Assign Another Course</h4>
                    <form className='add-class-container'>
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

export default AddCourse