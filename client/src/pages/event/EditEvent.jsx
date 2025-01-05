import "../../config/style/form.scss";
import { useEffect, useState } from "react";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useLocation } from "react-router-dom";
import useFetch from "../../config/service/useFetch";
import { putURLs } from "../../config/endpoints/put";
import { getSingleData } from "../../config/endpoints/get";
import { formatTime } from "../../config/endpoints/transform";
import { ClipLoader } from "react-spinners";
import { editElementWithPicture } from "../../config/service/usePut";
import DatePicker from "react-datepicker";

const EditEvent = ({ inputs, title }) => {
    const location = useLocation();
    const id = location.pathname.split("/")[4];
    const { data } = useFetch(getSingleData(id, "events"))
    const [info, setInfo] = useState({});
    const [file, setFile] = useState("");
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setInfo(data);
            setStart(data.startDate ? new Date(data.startDate) : null);
            setEnd(data.endDate ? new Date(data.endDate) : null);
        }
    }, [data, data.startDate, data.endDate])

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newInfo = {
                ...info,
                startDate: start,
                endDate: end
            }
            const res = await editElementWithPicture(file, newInfo, "event", putURLs("events", id));
            if(res.data.status === 'success') {
                window.location.reload();
            }
        } catch(err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    

    return (
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
                                (file)
                                    ? URL.createObjectURL(file)
                                    : (info.poster) ? info.poster : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
                                    <span style={{color: "green", fontWeight: "bold"}}>   Time : </span>{formatTime(start)}
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
                                    <span style={{color: "green", fontWeight: "bold"}}>    Time : </span>{formatTime(end)}
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
                                    />
                                </div>
                            ))}
                        </form>
                            <div className="submitButton">
                            { loading && <div className="create-loader">
                                <ClipLoader color="black" size={30} />
                                editing event...
                            </div>}
                                <button onClick={handleClick} className="form-btn">Edit Event</button>
                            </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditEvent;
