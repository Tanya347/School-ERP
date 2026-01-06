
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useSelector } from "react-redux";

import useFetch from '../../config/service/useFetch';
import { getDatatableURL, getTaskCalenderURL, getTestCalenderURL } from '../../config/endpoints/get';
import { eventsConst, locales, tasksConst, testsConst } from "../../config/utils/constants";

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

    useEffect(() => {

        const e1 = tasks?.map((t) => {
            const deadline = new Date(t.deadline)
            return {title: t.title, start:deadline, end: deadline, type: tasksConst}
        })

        const e2 = tests?.map((t) => {
            const date = new Date(t.date)
            return {title: t.name, start: date, end: date, type: testsConst}
        })

        const e3 = eventsData?.map((t) => {
            const s = new Date(t.startDate)
            const e = new Date(t.endDate)
            return {title: t.name, start: s, end: e, type: eventsConst}
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
        if(event.type === tasksConst)
            backgroundColor = 'var(--tree-green)'
        else if(event.type === testsConst)
            backgroundColor = 'var(--green)'
        else
            backgroundColor = 'var(--mild-turquoise)'
        return { style: { backgroundColor, textAlign: 'center' } };
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