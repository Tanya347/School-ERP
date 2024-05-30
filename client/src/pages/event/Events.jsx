import './events.scss'
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useContext, useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../../components/navbar/Navbar";
import useFetch from '../../config/hooks/useFetch';
import Modal from '../../components/popUps/Modal';
import { AuthContext } from '../../config/context/AuthContext';
import { getDatatableURL, getTaskCalenderURL, getTestCalenderURL } from '../../source/endpoints/get';
import EventModal from '../../components/popUps/EventModal';

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


const Events = () => {
    const { user } = useContext(AuthContext)
    const tasks = useFetch(getTaskCalenderURL(user)).data
    const tests = useFetch(getTestCalenderURL(user)).data
    const eventsData = useFetch(getDatatableURL("events")).data
    const [events, setEvents] = useState([]);
    const [clickedEvent, setClickedEvent] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {

        const e1 = tasks?.map((t) => {
            const deadline = new Date(t.deadline)
            return {title: t.title, start:deadline, end: deadline, type: 'tasks'}
        })

        const e2 = tests?.map((t) => {
            const date = new Date(t.date)
            return {title: t.name, start: date, end: date, type: 'tests'}
        })

        const e3 = eventsData?.map((t) => {
            const s = new Date(t.startDate)
            const e = new Date(t.endDate)
            return {title: t.name, start: s, end: e, type: 'events'}
        })
        setEvents([...e1, ...e2, ...e3]);
    }, [tasks, tests, eventsData])

    const handleEventPopup = (e) => {
        const {title, type} = e;
        let clickedItem = null;
        if (type === 'tasks') {
            clickedItem = tasks.find((item) => item.title === title);
        } else if (type === 'tests') {
            clickedItem = tests.find((item) => item.name === title);
        } else if (type === 'events') {
            clickedItem = eventsData.find((item) => item.name === title);
        }
        

        if (clickedItem) {
            setClickedEvent({ ...clickedItem, type });
            setOpenModal(true);
        }
    }

    const eventPropGetter = (event) => {
        let backgroundColor
        if(event.type === 'tasks')
            backgroundColor = '#C21292'
        else if(event.type === 'tests')
            backgroundColor = '#7451F8'
        else
            backgroundColor = '#F87451'
        return { style: { backgroundColor, textAlign: 'center' } };
    };

    return (
        <div className='events'>
            <Navbar />
            <div>
                <Calendar 
                    localizer={localizer} 
                    events={events} 
                    startAccessor="start" 
                    endAccessor="end" 
                    style={{ height: 500, margin: "50px" }} 
                    onSelectEvent={handleEventPopup}
                    eventPropGetter={eventPropGetter}
                />
                    
            </div>
            {openModal && clickedEvent.type !== 'events' && (
                <Modal setOpen={setOpenModal} id={clickedEvent._id} type={clickedEvent.type} />
            )}
            {openModal && clickedEvent.type === 'events' && (
                <EventModal setOpen={setOpenModal} event={clickedEvent} type="Main" />
            )}
        </div>

    )
}

export default Events