
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./events.scss";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useSelector } from "react-redux";

import useFetch from '../../utils/service/useFetch';
import { getDatatableURL, getTaskCalenderURL, getTestCalenderURL } from '../../utils/endpoints/get';
import { eventsConst, locales, tasksConst, testsConst } from "../../utils/shared/constants";

import Modal from '../../components/shared/modal/Modal';
import EventModal from '../../components/eventModal/EventModal';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


const Events = () => {
    const [events, setEvents] = useState([]);
    const [clickedEvent, setClickedEvent] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const { user } = useSelector(state => state.auth);
    const tasks = useFetch(getTaskCalenderURL(user)).data
    const tests = useFetch(getTestCalenderURL(user)).data
    const eventsData = useFetch(getDatatableURL(eventsConst)).data

    // Helper to get status for an item
    const getStatus = (item, type) => {
        const now = new Date();
        if (type === tasksConst) {
            const deadline = new Date(item.deadline);
            return now > deadline ? 'Overdue' : 'Pending';
        }
        if (type === testsConst) {
            return item.state || 'Pending';
        }
        if (type === eventsConst) {
            const endDate = new Date(item.endDate);
            return now > endDate ? 'Past' : 'Upcoming';
        }
        return 'Pending';
    };

    useEffect(() => {

        const e1 = tasks?.map((t) => {
            const deadline = new Date(t.deadline)
            return {
                title: t.title,
                start: deadline,
                end: deadline,
                type: tasksConst,
                status: getStatus(t, tasksConst)
            }
        })

        const e2 = tests?.map((t) => {
            const date = new Date(t.date)
            return {
                title: t.name,
                start: date,
                end: date,
                type: testsConst,
                status: getStatus(t, testsConst)
            }
        })

        const e3 = eventsData?.map((t) => {
            const s = new Date(t.startDate)
            const e = new Date(t.endDate)
            return {
                title: t.name,
                start: s,
                end: e,
                type: eventsConst,
                status: getStatus(t, eventsConst)
            }
        })
        setEvents([...e1, ...e2, ...e3]);
    }, [tasks, tests, eventsData])

    const handleEventPopup = (e) => {
        const {title, type} = e;
        let clickedItem = null;
        if (type === tasksConst) {
            clickedItem = tasks.find((item) => item.title === title);
        } else if (type === testsConst) {
            clickedItem = tests.find((item) => item.name === title);
        } else if (type === eventsConst) {
            clickedItem = eventsData.find((item) => item.name === title);
        }
        

        if (clickedItem) {
            setClickedEvent({ ...clickedItem, type });
            setOpenModal(true);
        }
    }

    const eventPropGetter = (event) => {
        let backgroundColor
        let opacity = 1;

        // Base color by type
        if(event.type === tasksConst)
            backgroundColor = 'var(--tree-green)'
        else if(event.type === testsConst)
            backgroundColor = 'var(--green)'
        else
            backgroundColor = 'var(--mild-turquoise)'

        // Status-based visual modifications
        if (event.status === 'Overdue' || event.status === 'Past' || event.status === 'cancelled') {
            opacity = 0.6;
        } else if (event.status === 'completed') {
            opacity = 0.8;
        }

        return {
            style: {
                backgroundColor,
                textAlign: 'center',
                opacity,
                borderLeft: event.status === 'cancelled' ? '4px solid #dc3545' : 'none',
            }
        };
    };

    // Custom event component to show status badge
    const EventComponent = ({ event }) => {
        return (
            <div className="rbc-event-content-wrapper">
                <div className="rbc-event-title">{event.title}</div>
                {event.status && (
                    <span className={`event-status-badge status-${event.status.toLowerCase()}`}>
                        {event.status}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className='events'>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "50px" }}
                    onSelectEvent={handleEventPopup}
                    eventPropGetter={eventPropGetter}
                    components={{
                        event: EventComponent
                    }}
                />
                    
            </div>
            {openModal && clickedEvent.type !== eventsConst && (
                <Modal setOpen={setOpenModal} id={clickedEvent._id} type={clickedEvent.type} />
            )}
            {openModal && clickedEvent.type === eventsConst && (
                <EventModal setOpen={setOpenModal} event={clickedEvent} type="Main" />
            )}
        </div>

    )
}

export default Events