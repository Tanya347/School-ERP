import "./newEvent.scss"
import "../../style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import DatePicker from "react-datepicker";

import axios from "axios"
import useFetch from "../../config/hooks/useFetch";

import EventModal from "../../components/popUps/EventModal";
import { postURLs } from "../../source/endpoints/post";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { getDatatableURL } from "../../source/endpoints/get";

const NewEvent = ({ inputs, title, type }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  // dates
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [list, setList] = useState([])

  const { data } = useFetch(getDatatableURL("events"))
  

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");

      try {
        const uploadRes = await axios.post(
          process.env.REACT_APP_CLOUDINARY,
          data, {
          withCredentials: false
        }
        )
        const { url } = uploadRes.data;
        const { public_id } = uploadRes.data;
        const newevent = {
          ...info, poster: url, cloud_id: public_id, startDate: start, endDate: end
        }
        axios.post(postURLs("events", "normal"), newevent, { withCredentials: false })
        window.location.reload();

      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const newevent = {
          ...info, startDate: start, endDate: end
        }
        await axios.post(postURLs("events", "normal"), newevent, { withCredentials: false })
        window.location.reload()
      }
      catch (err) {
        console.log(err)
      }
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
       {type === "Admin" ? <AdminNavbar /> : <Navbar />}
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

                  <DatePicker
                    class="date-picker"
                    showTimeSelect
                    placeholderText="Start Date"
                    style={{ marginRight: "10px" }}
                    selected={start}
                    onChange={(start) => setStart(start)}
                    />
                  
                  <DatePicker
                    class="date-picker"
                    showTimeSelect
                    placeholderText="End Date"
                    selected={end}
                    onChange={(end) => setEnd(end)}
                    />

                  {inputs?.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input onChange={handleChange} type={input.type} placeholder={input.placeholder} id={input.id} />
                    </div>
                  ))}

                </form>
                <div className="submitButton">
                  <button onClick={handleClick} className="form-btn">Create Event</button>
                </div>
              </div>
              </div>
              </div>
            </div></>}

        {!openForm && <div className="cardsContainer">
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
        </div>}
      </div>

      {openModal && <EventModal setOpen={setOpenModal} event={clickedEvent} type={type} />}
    </div>
  );
};

export default NewEvent;