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
import { getCalenderURL } from '../../source/endpoints/get';

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
    const tasks = useFetch(getCalenderURL(user)).data
    const tests = useFetch("/tests").data
    const [events, setEvents] = useState([]);
    const [clickedEvent, setClickedEvent] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {

        // const e = data.map((d) => {
        //     const startDate = new Date(d.startDate);
        //     const endDate = new Date(d.endDate);

        //     return { title: d.name, start: startDate, end: endDate};
        // })

        const e1 = tasks.map((t) => {
            const deadline = new Date(t.deadline)
            return {title: t.title, start:deadline}
        })

        const e2 = tests.map((t) => {
            const date = new Date(t.date)
            return {title: `${t.author} Test`, start: date}
        })
        setEvents([...e1, ...e2]);
    }, [tasks, tests])

    const handleEventPopup = (e) => {
        if (e.target.className === "rbc-event-content") {
            const event = tasks.filter((item) => { return item["title"] === e.target.title }
            );
            setClickedEvent(event[0]);
            setOpenModal(true)
        }
    }

    return (
        <div className='events'>
            <Navbar />
            <div onClick={handleEventPopup}>
                <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="start" style={{ height: 500, margin: "50px" }} />
            </div>
            {openModal && <Modal setOpen={setOpenModal} id={clickedEvent._id} type="tasks"/>}
        </div>

    )
}

export default Events