import "../../config/style/form.scss";

import { useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { postURLs } from "../../config/endpoints/post";
import { ClipLoader } from "react-spinners";
import { createElementWithPicture } from "../../config/service/usePost";
import DatePickerComponent from "../../components/datepicker/Datepicker";
import { useNavigate } from "react-router-dom";

const NewEvent = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  // dates
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  

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
        navigate("/admin/events")
      }
    } catch(err) {
      console.log(err)
    } finally {
      setSubmitLoading(false)
    }

  }

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setFile("");
    setStart("");
    setEnd("");
    window.location.reload(false);
  }

  return (

    <div className="event-container">
      {/* <Sidebar /> */}
      <div className="newEventContainer">
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
                    : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
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
                  <button className="clear-btn" onClick={handleClear}>Clear</button>
                  <button onClick={handleClick} className="form-btn">Create Event</button>
                </div>
              </div>
              </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default NewEvent;