import "./eventModal.scss"

import CancelIcon from '@mui/icons-material/Cancel';

import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { eventsConst } from "../../utils/shared/constants";

import { formatDate, formatTime, normalizeUrl, checkSuccess } from "../../utils/shared/commons";
import { getDeleteURL } from "../../utils/endpoints/delete";
import axiosInterceptor from "../../utils/shared/axiosInterceptor";

// setOpen prop, event is the event we need to display and isUser will only allow the user to delete/edit the event

const EventModal = ({ setOpen, event, type }) => {

    // start and end date of the event
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    // Check if event has passed (expired)
    const isEventPast = new Date() > end

    // deleting the event
    const handleDelete = async () => {
        try {
            const res = await axiosInterceptor.delete(getDeleteURL(eventsConst, event._id));
            if(checkSuccess(res.data.status)) {
                toast.success("Event deleted successfully!");
            }
            window.location.reload();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to create user. Please try again.";
            toast.error(errorMessage);
            return err;
        }
    };

    return (

        <div className="event-modal">
            <div className="m-container">
                
                <CancelIcon
                    className="m-close"
                    onClick={() => setOpen(false)}
                />

                <div className="m-events">

                    {/* Show the event poster if it exists */}
                    {event.poster && <div className="m-left">
                        <img src={event.poster} alt="" />
                    </div>}


                    <div className="m-right">

                        {/* Details */}
                        <div className="m-title">{event.name}</div>
                        <div className="m-desc">{event.desc}</div>

                        {/* Event details */}
                        <p><span>Start Date</span>: {formatDate(start)} {formatTime(start)}</p>
                        <p><span>End Date</span>: {formatDate(end)} {formatTime(end)}</p>
                        <p><span>Venue</span> : {event.venue}</p>
                        

                        {/* If meet link and resiter link exist display them */}
                        {
                            event.meetLink && <button className="m-button">
                                <a
                                    style={{ textDecoration: "none", color: "white" }}
                                    href={normalizeUrl(event.meetLink)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Event Link
                                </a>
                            </button>
                        }

                        {
                        event.registerLink && !isEventPast && (
                            <button className="m-button">
                                <a
                                    href={normalizeUrl(event.registerLink)}
                                    style={{ textDecoration: "none", color: "white" }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Register for Event
                                </a>
                            </button>
                        )}
                        {isEventPast && <span className="event-expired-badge">Event Ended</span>}

                        {/* Other Details */}
                        <p><span>Contact Details</span> : {event.contact}</p>
                        
                        {/* Allow only owner to edit/delete the event*/}
                        {
                            type === "Admin" && <div className="crud-button">
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