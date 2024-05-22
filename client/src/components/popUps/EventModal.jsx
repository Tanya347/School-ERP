import "./eventModal.css"

import CancelIcon from '@mui/icons-material/Cancel';

import { Link } from "react-router-dom"

import axios from 'axios';


// setOpen prop, event is the event we need to display and isUser will only allow the user to delete/edit the event

const EventModal = ({ setOpen, event, isUser }) => {

    // start and end date of the event
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)

    // deleting the event
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5500/api/events/${event._id}`, { withCredentials: false });
            window.location.reload();
        } catch (err) {
            console.log(err)
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
                                <p><span>Date</span> : {start.getDate()} / {start.getMonth()} / {start.getFullYear()}</p>
                            )
                            :
                            (
                                <>
                                    <p><span>From</span> : {start.getDate()} / {start.getMonth()} / {start.getFullYear()}</p>
                                    <p><span>To</span> : {end.getDate()} / {end.getMonth()} / {end.getFullYear()}</p>
                                </>
                            )
                        }
                        
                        <p><span>Time</span> : {start.getHours() >= 12 ? start.getHours() % 12 : start.getHours()} {start.getHours() >= 12 ? "PM" : "AM"} - {end.getHours() >= 12 ? end.getHours() % 12 : end.getHours} {end.getHours() >= 12 ? "PM" : "AM"}</p>
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
                        <p style={{ marginTop: "20px" }}><span>Organized by</span> : {event.teamName}</p>
                        <p><span>Contact Details</span> : {event.contact}</p>
                        
                        {/* Allow only owner to edit/delete the event*/}
                        {
                            isUser && <div className="crudButton">
                                <Link to={`/events/${event._id}`}>
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