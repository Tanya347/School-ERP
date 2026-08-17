import "../../utils/style/form.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { postURLs } from "../../utils/endpoints/post";
import { putURLs } from "../../utils/endpoints/put";
import { createElementWithPicture } from "../../utils/service/postHelper";
import { editElementWithPicture } from "../../utils/service/putHelper";
import { validateEvent } from "../../utils/validators/event";
import { checkSuccess, formatTime, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { eventsConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import FileUpload from "../../components/shared/fileUpload/FileUpload";
import InlineError from "../../components/shared/inlineError/InlineError";
import DatePicker from "react-datepicker";

const EventForm = ({ mode, inputs, title }) => {
  const [info, setInfo] = useState({});
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const { id: mainId, eventId } = useParams();
  const id = mainId || eventId;
  const navigate = useNavigate();

  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, eventsConst) : null
  );

  useEffect(() => {
    if (mode === "edit" && data) {
      setInfo(data);
      setStart(data.startDate ? new Date(data.startDate) : null);
      setEnd(data.endDate ? new Date(data.endDate) : null);
    }
  }, [data, mode]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateEvent);
  };

  const handleDeleteImage = () => {
    setIsImageDeleted(!isImageDeleted);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...info,
        startDate: start,
        endDate: end,
        isImageDeleted: mode === "edit" ? isImageDeleted : false,
      };

      const res = await (mode === "create"
        ? createElementWithPicture(file, payload, "event", postURLs(eventsConst, "normal"))
        : editElementWithPicture(file, payload, "event", putURLs("events", id))
      );

      if (checkSuccess(res.data.status)) {
        navigate('/admin/events');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setFile("");
    setStart(null);
    setEnd(null);
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading event data"
        message={error.response?.data?.message || error.message}
        onRetry={reFetch}
      />
    );
  }

  return (
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
              existingUrl={mode === "edit" ? info.poster : ""}
              label="Image"
              iconType="outlined"
              onDeleteImage={mode === "edit" ? handleDeleteImage : null}
              isImageDeleted={mode === "edit" ? isImageDeleted : false}
            />
            <form>
              <div className="form-input">
                <label>
                  <span style={{ color: "#1AACAC", fontWeight: "bold" }}>Start Time : </span>
                  {start ? formatTime(start) : "No start time selected"}
                </label>
                {start && (
                  <DatePicker
                    selected={start}
                    onChange={(date) => setStart(date)}
                    placeholderText="Start Date"
                    showTimeSelect
                  />
                )}
              </div>
              <div className="form-input">
                <label>
                  <span style={{ color: "#1AACAC", fontWeight: "bold" }}>End Time : </span>
                  {end ? formatTime(end) : "No end time selected"}
                </label>
                <DatePicker
                  className="date-picker"
                  showTimeSelect
                  placeholderText="End Date"
                  selected={end}
                  onChange={(date) => setEnd(date)}
                />
              </div>
              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
                type={mode === "edit" ? "edit" : "create"}
              />
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "Creating Event..." : "Editing Event..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button
                onClick={handleClick}
                disabled={loading}
                className="form-btn"
              >
                {mode === "create" ? "Create Event" : "Edit Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
