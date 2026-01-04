import "./modal.scss"

import CancelIcon from '@mui/icons-material/Cancel';

import { useState } from "react";
import { toast } from "react-toastify"
import axiosInterceptor from "../../../config/axiosInterceptor";

import useFetch from "../../../config/service/useFetch"
import { getModalURL } from "../../../config/endpoints/get";
import { formatDate } from "../../../config/commons";
import { putURLs } from "../../../config/endpoints/put";

// setOpen prop, id is the id of the data we need to display and type will tell whether it's task or update

const Modal = ({ setOpen, id, type }) => {

    const [info, setInfo] = useState({});

    const { data } = useFetch(getModalURL(type, id));

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const handleClick = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axiosInterceptor.put(putURLs("queries", id), info)
            if(res.data.status === 'success') {
                toast.success("Query updated successfully!");
            }
            setOpen(false)
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to create user. Please try again.";
            toast.error(errorMessage);
            return err;
        }
    }

    return (
        <div className="modal">
            <div className="m-container">

                {/* setOpen set to false so that pop up closes */}
                <CancelIcon
                    className="m-close"
                    onClick={() => setOpen(false)}
                />
                
                {/* if type is updates */}
                {
                    type === "updates" &&
                    <div className="m-tasks">
                        <div className="m-title">{data.title}</div>
                        <div className="m-desc">{data.desc}</div>
                        {data.updateType === "specific" && <p><span>For</span>: Class {data?.class?.name}</p>}
                    </div>
                }

                {/* If type is tasks */}
                {
                    (type === "facTasks" || type==="stuTasks" || type === 'tasks') &&
                    <div className="m-tasks">
                        <div className="m-title">{data.title}</div>
                        <div className="m-desc">{data.desc}</div>
                        <p><span>Deadline</span> : {formatDate(data.deadline)}</p>
                        <p><span>Assigned To</span> : {data?.sclass?.name}</p>
                        <p><span>Assigned By</span>: {data?.author?.teachername}</p>
                    </div>
                }

                {/* If type is tasks */}
                {
                    (type === "facTests" || type==="stuTests" || type === 'tests') &&
                    <div className="m-tasks">
                        <div className="m-title">{data?.name}</div>
                        <p><span>Syllabus</span> : {data?.syllabus}</p>
                        <p><span>Duration</span> : {data?.duration} min</p>
                        <p><span>Date</span> : {formatDate(data.date)}</p>
                        <p><span>Assigned To</span> : {data?.sclass?.name}</p>
                        <p><span>Subject</span>: {data?.subject?.name}</p>
                        <p><span>Assigned By</span>: {data?.author?.teachername}</p>
                    </div>
                }

                {/* If type is query */}
                {
                    type === "queries" &&
                    <div className="m-tasks">
                        <div className="m-title">{data.title}</div>
                        <div className="m-desc">{data.description}</div>
                        <textarea
                            name="response"
                            id="response"
                            cols="30"
                            rows="10"
                            value={data.response}
                            onChange={handleChange}
                            placeholder='Respond to the query'>
                        </textarea>
                        <button className="m-button" onClick={handleClick}>
                            Done
                        </button>
                    </div>
                }

                {/* If type is tasks */}
                {
                    type === "courses" &&
                    <div className="m-tasks">
                        <div className="m-title">{data?.subjectCode} {data?.name}</div>
                        {data.syllabusPicture && <img className="syll" src={data.syllabusPicture} alt="syllabus"/>}
                        {data.teacher && <p><span>Taught by</span> : {data?.teacher?.teachername}</p>}
                        <p><span>Class</span> : {data?.class?.name}</p>
                        
                    </div>
                }
                
            </div>
        </div>
    )
}

export default Modal