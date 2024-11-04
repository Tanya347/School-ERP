import "./eventModal.css"

import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from "react-router-dom"
import axios from 'axios';
import { formatDate, formatTime } from "../../config/endpoints/transform";
import { getDeleteURL } from "../../config/endpoints/delete";
import { toast } from "react-toastify"

// setOpen prop, event is the event we need to display and isUser will only allow the user to delete/edit the event

const EventModal = ({ setOpen, event, type }) => {

    // start and end date of the event
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    // deleting the event
    const handleDelete = async () => {
        try {
            const res = await axios.delete(getDeleteURL("events", event._id), { withCredentials: true });
            if(res.data.status === 'success') {
                toast.success("Event deleted successfully!");
            }
            window.location.reload();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to create user. Please try again.";
            toast.error(errorMessage);
            console.error(err);
            return err;
        }
    };

    return (

        <div className="eventModal">
            <div className="mContainer">
                
                <CancelIcon
                    className="mClose"
                    onClick={() => setOpen(false)}
                />

                <div className="mEvents">

                    {/* Show the event poster if it exists */}
                    {event.poster && <div className="mLeft">
                        <img src={event.poster} alt="" />
                    </div>}


                    <div className="mRight">

                        {/* Details */}
                        <div className="mTitle">{event.name}</div>
                        <div className="mDesc">{event.desc}</div>

                        {/* Event details */}
                        {start.getDate() === end.getDate() ? 
                            (
                                <p><span>Date</span> : {formatDate(start)}</p>
                            )
                            :
                            (
                                <>
                                    <p><span>From</span> : {formatDate(start)}</p>
                                    <p><span>To</span> : {formatDate(end)}</p>
                                </>
                            )
                        }
                        
                        <p><span>Time</span> : {formatTime(start)} - {formatTime(end)}</p>
                        <p><span>Venue</span> : {event.venue}</p>
                        

                        {/* If meet link and resiter link exist display them */}
                        {
                            event.meetLink && <button className="mButton">
                                <a style={{ textDecoration: "none", color: "white" }} href={event.meetLink}>
                                    Event Link
                                </a>
                            </button>
                        }

                        {
                        event.registerLink && <button className="mButton">
                                <a href={event.registerLink} style={{ textDecoration: "none", color: "white" }}>
                                    Register for Event
                                </a>
                            </button>
                        }

                        {/* Other Details */}
                        <p><span>Contact Details</span> : {event.contact}</p>
                        
                        {/* Allow only owner to edit/delete the event*/}
                        {
                            type === "Admin" && <div className="crudButton">
                                <Link to={`/admin/events/edit/${event._id}`}>
                                    <button>Edit</button>
                                </Link>
                                <button onClick={handleDelete}>Delete</button>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventModal