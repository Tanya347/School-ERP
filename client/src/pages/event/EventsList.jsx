import { getDatatableURL } from "../../config/endpoints/get"
import EventModal from "../../components/popUps/EventModal";
import { useState } from "react";
import useFetch from "../../config/service/useFetch";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";
import './eventsList.scss'

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

    return (
        <div className="event-container">{loading ? (
          <div className="page-loader">
            <ClipLoader color="black" size={50} />
            <h3>Loading data...</h3>
          </div>
        ) : (<div className="cardsContainer">
          {list?.map((item, i) => (
            <div className="card" key={item._id}>
              <div class="content">
                {item.poster ? <img id="post-image" src={item.poster} alt="" /> : "no image"}
                <h4>{item.name}</h4>
                <p>{item.desc.slice(0, 60)}...</p>
                <button onClick={() => handleEventPopup(item._id)}>View</button>
              </div>
            </div>
          ))}
        </div>)}
        {openModal && <EventModal setOpen={setOpenModal} event={clickedEvent} type={type} />}
        </div>
    )
}

export default EventsList