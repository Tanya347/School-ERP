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
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/modal/Modal';
import { AuthContext } from '../../context/AuthContext';
import { getTaskCalenderURL, getTestCalenderURL } from '../../source/endpoints/get';

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
    const [events, setEvents] = useState([]);
    const [clickedEvent, setClickedEvent] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {

        const e1 = tasks.map((t) => {
            const deadline = new Date(t.deadline)
            return {title: t.title, start:deadline, type: 'tasks'}
        })

        const e2 = tests.map((t) => {
            const date = new Date(t.date)
            return {title: t.name, start: date, type: 'tests'}
        })
        setEvents([...e1, ...e2]);
    }, [tasks, tests])

    const handleEventPopup = (e) => {
        const {title, type} = e;
        let clickedItem = null;
        if (type === 'tasks') {
            clickedItem = tasks.find((item) => item.title === title);
        } else if (type === 'tests') {
            clickedItem = tests.find((item) => item.name === title);
        }
        

        if (clickedItem) {
            setClickedEvent({ ...clickedItem, type });
            setOpenModal(true);
        }
    }

    const eventPropGetter = (event) => {
        const backgroundColor = event.type === 'tasks' ? '#7451F8' : '#F87451';
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
                    endAccessor="start" 
                    style={{ height: 500, margin: "50px" }} 
                    onSelectEvent={handleEventPopup}
                    eventPropGetter={eventPropGetter}
                />
                    
            </div>
            {openModal && <Modal setOpen={setOpenModal} id={clickedEvent._id} type={clickedEvent.type}/>}
        </div>

    )
}

export default Events