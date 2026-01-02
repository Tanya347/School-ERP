import "../../config/style/form.scss";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import useFetch from "../../config/service/useFetch";
import { putURLs } from "../../config/endpoints/put";
import { getSingleData } from "../../config/endpoints/get";
import { formatTime } from "../../config/commons";
import { editElementWithPicture } from "../../config/service/usePut";
import { validateEvent } from "../../config/validators/event";
import { handleChange as commonHandleChange} from "../../config/commons"

import Loader from "../../components/shared/loader/Loader";

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
    const { data, loading } = useFetch(getSingleData(id, "events"))

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
                ...info,
                startDate: start,
                endDate: end
            }
            const res = await editElementWithPicture(file, newInfo, "event", putURLs("events", id));
            if(res.data.status === 'success') {
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
                 <div className="newContainer">
                    <div className="top">
                        <h1>{title}</h1>
                    </div>
                    <div className="bottom">
                        <div className="right">
                        <div className="left">
                            <img
                                src={
                                    (file)
                                        ? URL.createObjectURL(file)
                                        : (info.poster) ? info.poster : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
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

                                <div className="formInput">
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

                                <div className="formInput">
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


                                {inputs?.map((input) => (
                                    <div className="formInput" key={input.id}>
                                        <label>{input.label}</label>
                                        <input onChange={handleChange}
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            id={input.id}
                                            value={info[`${input.id}`]}
                                            className={errors[input.id] ? "error-input" : ""}
                                        />
                                        {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                                    </div>
                                ))}
                            </form>
                                <div className="submitButton">
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
