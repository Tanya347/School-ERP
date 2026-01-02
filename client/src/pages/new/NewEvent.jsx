import "../../config/style/form.scss";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { postURLs } from "../../config/endpoints/post";
import { createElementWithPicture } from "../../config/service/usePost";
import { validateEvent } from "../../config/validators/event";
import { handleChange as commonHandleChange } from "../../config/commons";

import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import Loader from "../../components/shared/loader/Loader";

const NewEvent = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const [start, setStart] = useState("")
  const [errors, setErrors] = useState({});
  const [end, setEnd] = useState("")
  

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateEvent);
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
                    className="date-picker"
                  />
                  
                  <DatePickerComponent 
                    placeholder="End Date"
                    selectedDate={end}
                    onChange={(end) => setEnd(end)}
                    label="Select End Date and Time"
                    className="date-picker"
                  />

                  {inputs?.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input
                        onChange={handleChange}
                        type={input.type}
                        placeholder={input.placeholder}
                        id={input.id}
                        className={errors[input.id] ? "error-input" : ""}
                        value={info[input.id] || ""}
                      />
                      {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                    </div>
                  ))}

                </form>
                <div className="submitButton">
                { submitLoading && <Loader text="Creating Event..." /> }
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