import './eventsList.scss'

import { useEffect, useState } from "react";

import { getDatatableURL } from "../../config/endpoints/get"
import useFetch from "../../config/service/useFetch";

import Loader from "../../components/shared/loader/Loader";
import EventModal from "../../components/eventModal/EventModal";

const EventsList = ({type}) => {
  
    const [list, setList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [clickedEvent, setClickedEvent] = useState({});

    const { data, loading } = useFetch(getDatatableURL("events"));

    useEffect(() => {
        setList(data)
    }, [data])

    const handleEventPopup = (id) => {
        const event = data.filter((item) => { return item["_id"] === id }
        );
        setClickedEvent(event[0]);
        setOpenModal(true)
    }

    const getEventStatus = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) return "Upcoming";
      if (now > end) return "Past";
      return "Ongoing";
    };

    return (
      <div className="events-list">

        <div className="events-title">Events List</div>
        <div className="event-container">{loading ? (
          <Loader text="Loading events..." type="global" />
        ) : (<div className="cardsContainer">
          {list?.map((item, i) => (
            <div className="card" key={item._id}>
              <div class="content">
                {<img id="post-image" src={item.poster? item.poster : "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg"} alt="" />}
                <h4>{item.name}</h4>
                <span className={`event-tag ${getEventStatus(item.startDate, item.endDate).toLowerCase()}`}>
                  {getEventStatus(item.startDate, item.endDate)}
                </span>
                <p>{item.desc.slice(0, 60)}...</p>
                <button onClick={() => handleEventPopup(item._id)}>View</button>
              </div>
            </div>
          ))}
        </div>)}
        {openModal && <EventModal setOpen={setOpenModal} event={clickedEvent} type={type} />}
        </div>
      </div>
    )
}

export default EventsList