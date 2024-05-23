import "./modal.css"

import CancelIcon from '@mui/icons-material/Cancel';
import useFetch from "../../config/hooks/useFetch"
import { useState } from "react";
import axios from "axios";
import { getModalURL } from "../../source/endpoints/get";
import { putURLs } from "../../source/endpoints/put";


// setOpen prop, id is the id of the data we need to display and type will tell whether it's task or update

const Modal = ({ setOpen, id, type }) => {

    // fetch the required data
    const { data } = useFetch(getModalURL(type, id));

    const [info, setInfo] = useState({});

    // set the usestate to the data user passed 
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }


    // post the usestate to database
    const handleClick = async (e) => {
        e.preventDefault();
        
        try {
            await axios.put(putURLs("queries", id), info, {
                withCredentials: false
            })
            setOpen(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="modal">
            <div className="mContainer">

                {/* setOpen set to false so that pop up closes */}
                <CancelIcon
                    className="mClose"
                    onClick={() => setOpen(false)}
                />
                
                {/* if type is updates */}
                {
                    type === "updates" &&
                    <div className="mTasks">
                        <div className="mTitle">{data.title}</div>
                        <div className="mDesc">{data.desc}</div>
                        {data.updateType === "specific" && <p><span>For</span>: Class {data?.class?.name}</p>}
                    </div>
                }

                {/* If type is tasks */}
                {
                    (type === "facTasks" || type==="stuTasks" || type === 'tasks') &&
                    <div className="mTasks">
                        <div className="mTitle">{data.title}</div>
                        <div className="mDesc">{data.desc}</div>
                        <p><span>Deadline</span> : {new Date(data.deadline).toLocaleDateString()}</p>
                        <p><span>Assigned To</span> : {data?.sclass?.name}</p>
                        <p><span>Assigned By</span>: {data?.author?.teachername}</p>
                    </div>
                }

                {/* If type is tasks */}
                {
                    (type === "facTests" || type==="stuTests" || type === 'tests') &&
                    <div className="mTasks">
                        <div className="mTitle">{data?.name}</div>
                        <p><span>Syllabus</span> : {data?.syllabus}</p>
                        <p><span>Duration</span> : {data?.duration} min</p>
                        <p><span>Date</span> : {new Date(data.date).toLocaleDateString()}</p>
                        <p><span>Assigned To</span> : {data?.sclass?.name}</p>
                        <p><span>Subject</span>: {data?.subject?.name}</p>
                        <p><span>Assigned By</span>: {data?.author?.teachername}</p>
                    </div>
                }

                {/* If type is query */}
                {
                    type === "queries" &&
                    <div className="mTasks">
                        <div className="mTitle">{data.title}</div>
                        <div className="mDesc">{data.description}</div>
                        <textarea
                            name="response"
                            id="response"
                            cols="30"
                            rows="10"
                            value={data.response}
                            onChange={handleChange}
                            placeholder='Respond to the query'>
                        </textarea>
                        <button className="mButton" onClick={handleClick}>
                            Done
                        </button>
                    </div>
                }

                {/* If type is tasks */}
                {
                    type === "courses" &&
                    <div className="mTasks">
                        <div className="mTitle">{data?.subjectCode} {data?.name}</div>
                        {data.syllabusPicture && <img className="syll" src={data.syllabusPicture} alt="syllabus picture"/>}
                        {data.teacher && <p><span>Taught by</span> : {data?.teacher?.teachername}</p>}
                        <p><span>Class</span> : {data?.class?.name}</p>
                        
                    </div>
                }
                
            </div>
        </div>
    )
}

export default Modal