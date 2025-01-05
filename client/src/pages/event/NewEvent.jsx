import "./newEvent.scss"
import "../../config/style/form.scss";

import { useEffect, useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import useFetch from "../../config/service/useFetch";
import EventModal from "../../components/popUps/EventModal";
import { postURLs } from "../../config/endpoints/post";
import { getDatatableURL } from "../../config/endpoints/get";
import { ClipLoader } from "react-spinners";
import { createElementWithPicture } from "../../config/service/usePost";
import DatePickerComponent from "../../components/datepicker/Datepicker";

const NewEvent = ({ inputs, title, type }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // dates
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [list, setList] = useState([])

  const { data, loading } = useFetch(getDatatableURL("events"))
  

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {

      const newInfo = {
        ...info,
        startDate: start,
        endDate: end
      }
      const res = await createElementWithPicture(file, newInfo, "event", postURLs("events", "normal"));
      if(res.data.status === 'success') {
        window.location.reload();
      }
    } catch(err) {
      console.log(err)
    } finally {
      setSubmitLoading(false)
    }

  }


  const [openForm, setOpenForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({});

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

    <div className="event-container">
      {/* <Sidebar /> */}
      <div className="newEventContainer">
        {type === "Admin" && <div className="eventsButton">
          <button onClick={() => setOpenForm(false)} >View Events</button>
          <button onClick={() => setOpenForm(true)} >Create Events</button>
        </div>}
        {openForm && type === "Admin" &&
          <>
          <div className="new">
          <div className="newContainer">

          <div className="top">
            <h1>{title}</h1>
          </div>
            <div className="bottom">
                <div className="right">
              <div className="left">
                <img
                  src={
                    file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                  />
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlinedIcon className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                      />
                  </div>
              </div>
                <form>

                  <DatePickerComponent 
                    placeholder="Start Date"
                    selectedDate={start}
                    onChange={(start) => setStart(start)}
                    label="Select Start Date and Time"
                  />
                  
                  <DatePickerComponent 
                    placeholder="End Date"
                    selectedDate={end}
                    onChange={(end) => setEnd(end)}
                    label="Select End Date and Time"
                  />

                  {inputs?.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input onChange={handleChange} type={input.type} placeholder={input.placeholder} id={input.id} />
                    </div>
                  ))}

                </form>
                <div className="submitButton">
                { submitLoading && <div className="create-loader">
                    <ClipLoader color="black" size={30} />
                    creating event...
                  </div>}
                  <button onClick={handleClick} className="form-btn">Create Event</button>
                </div>
              </div>
              </div>
              </div>
            </div></>}

        {!openForm && <>{loading ? (
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
        </div>)} </>}
      </div>

      {openModal && <EventModal setOpen={setOpenModal} event={clickedEvent} type={type} />}
    </div>
  );
};

export default NewEvent;