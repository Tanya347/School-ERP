import "./modal.scss"

import CancelIcon from '@mui/icons-material/Cancel';

import useFetch from "../../../utils/service/useFetch"
import { getModalURL } from "../../../utils/endpoints/get";
import { formatDate } from "../../../utils/shared/commons";

// setOpen prop, id is the id of the data we need to display and type will tell whether it's task or update

const Modal = ({ setOpen, id, type }) => {

    const { data } = useFetch(getModalURL(type, id));
    
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
                        {data.updateType === "specific" && <p><span>For</span>: Class {data?.classID?.name}</p>}
                    </div>
                }

                {/* If type is tasks */}
                {
                    (type === "facTasks" || type==="stuTasks" || type === 'tasks') &&
                    <div className="m-tasks">
                        <div className="m-title">{data.title}</div>
                        <div className="m-desc">{data.desc}</div>
                        <p><span>Deadline</span> : {formatDate(data.deadline)}</p>
                        <p><span>Assigned To</span> : {data?.courseID?.subjectCode} {data?.courseID?.name}</p>
                        <p><span>Assigned By</span>: {data?.author?.teachername}</p>
                    </div>
                }

                {/* If type is tests */}
                {
                    (type === "facTests" || type==="stuTests" || type === 'tests') &&
                    <div className="m-tasks">
                        <div className="m-title">{data?.name}</div>
                        <p><span>Syllabus</span> : {data?.syllabus}</p>
                        <p><span>Duration</span> : {data?.duration} min</p>
                        <p><span>Date</span> : {formatDate(data.date)}</p>
                        <p><span>Assigned To</span> : {data?.classID?.name}</p>
                        <p><span>Subject</span>: {data?.subject?.name}</p>
                        <p><span>Assigned By</span>: {data?.author?.teachername}</p>
                    </div>
                }

                {/* If type is courses */}
                {
                    type === "courses" &&
                    <div className="m-tasks">
                        <div className="m-title">{data?.subjectCode} {data?.name}</div>
                        {data.syllabusPicture && <img className="syll" src={data.syllabusPicture} alt="syllabus"/>}
                        {data.teacher && <p><span>Taught by</span> : {data?.teacher?.teachername}</p>}
                        <p><span>Class</span> : {data?.classID?.name}</p>
                        
                    </div>
                }
                
            </div>
        </div>
    )
}

export default Modal