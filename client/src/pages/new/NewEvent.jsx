import "../../utils/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { postURLs } from "../../utils/endpoints/post";
import { createElementWithPicture } from "../../utils/service/usePost";
import { validateEvent } from "../../utils/validators/event";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { eventsConst } from "../../utils/shared/constants";

import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";

const NewEvent = ({ inputs, title }) => {
  
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [start, setStart] = useState("")
  const [errors, setErrors] = useState({});
  const [end, setEnd] = useState("")
  
  const navigate = useNavigate();

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
      const res = await createElementWithPicture(file, newInfo, "event", postURLs(eventsConst, "normal"));
      if(checkSuccess(res.data.status)) {
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
          <div className="new-container">

          <div className="top">
            <h1>{title}</h1>
          </div>
            <div className="bottom">
                <div className="form-container">
                    <FileUpload
                      file={file}
                      setFile={setFile}
                      label="Image"
                      iconType="outlined"
                    />
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

                  <FormInputs
                    inputs={inputs}
                    values={info}
                    errors={errors}
                    onChange={handleChange}
                  />

                </form>
                <div className="submit-button">
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