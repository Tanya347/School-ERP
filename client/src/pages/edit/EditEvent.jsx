import "../../config/style/form.scss";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import useFetch from "../../config/service/useFetch";
import { putURLs } from "../../config/endpoints/put";
import { getSingleData } from "../../config/endpoints/get";
import { formatTime } from "../../config/utils/commons";
import { editElementWithPicture } from "../../config/service/usePut";
import { validateEvent } from "../../config/validators/event";
import { handleChange as commonHandleChange} from "../../config/utils/commons"
import { eventsConst, successMsg } from "../../config/utils/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs"
import FileUpload from "../../components/shared/fileUpload/FileUpload";

const EditEvent = ({ inputs, title }) => {

    const [info, setInfo] = useState({});
    const [file, setFile] = useState("");
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [sending, setSending] = useState(false);
    const [errors, setErrors] = useState({});

    const location = useLocation();
    const navigate = useNavigate();

    const id = location.pathname.split("/")[4];
    const { data, loading } = useFetch(getSingleData(id, eventsConst))

    useEffect(() => {
        if (data) {
            setInfo(data);
            setStart(data.startDate ? new Date(data.startDate) : null);
            setEnd(data.endDate ? new Date(data.endDate) : null);
        }
    }, [data, data.startDate, data.endDate])

    const handleChange = (e) => {
        commonHandleChange(e, setInfo, setErrors, validateEvent);
    }

    const handleClick = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const newInfo = {
                name: info.name,
                desc: info.desc,
                venue: info.venue,
                contact: info.contact,
                registerLink: info.registerLink,
                startDate: start,
                endDate: end
            }
            const res = await editElementWithPicture(file, newInfo, "event", putURLs("events", id));
            if(res.data.status === successMsg) {
                navigate('/admin/events');
            }
        } catch(err) {
            console.log(err)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="new">
           {loading ? (
                <Loader text="Loading data..." type="global" />
           ) : (
            <>
                 <div className="new-container">
                    <div className="top">
                        <h1>{title}</h1>
                    </div>
                    <div className="bottom">
                        <div className="right">
                        <FileUpload
                            file={file}
                            setFile={setFile}
                            existingUrl={info.poster}
                            label="Image"
                            iconType="outlined"
                        />
                            <form>

                                <div className="form-input">
                                        <label>
                                            <span style={{ color: "#1AACAC", fontWeight: "bold" }}>Time : </span>
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
                                        <span style={{ color: "#1AACAC", fontWeight: "bold" }}>Time : </span>
                                        {end ? formatTime(end) : "No end time selected"}
                                    </label>
                                    
                                    <DatePicker
                                        class="date-picker"
                                        showTimeSelect
                                        placeholderText="End Date"
                                        selected={end}
                                        onChange={(end) => setEnd(end)}
                                    />
                                </div> 


                                <FormInputs
                                    inputs={inputs}
                                    values={info}
                                    errors={errors}
                                    onChange={handleChange}
                                />
                            </form>
                                <div className="submit-button">
                                { sending && <Loader text="editing event..."/>}
                                    <button onClick={handleClick} className="form-btn">Edit Event</button>
                                </div>
                        </div>
                    </div>

                </div>
            </>
           )}
        </div>
    );
};

export default EditEvent;
