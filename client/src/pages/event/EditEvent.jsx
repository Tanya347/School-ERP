import "../../style/form.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import useFetch from "../../config/hooks/useFetch";
import { putURLs } from "../../source/endpoints/put";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { getSingleData } from "../../source/endpoints/get";
import { formatTime } from "../../source/endpoints/transform";

const EditEvent = ({ inputs, title }) => {
    const location = useLocation();
    const id = location.pathname.split("/")[4];
    const [info, setInfo] = useState({});
    const [file, setFile] = useState("");
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null)
    const { data } = useFetch(getSingleData(id, "events"))

    const navigate = useNavigate();


    useEffect(() => {
        setInfo(data)
        if(data.startDate)
            setStart(new Date(data.startDate))
        if(data.endDate)
            setEnd(new Date(data.endDate))
    }, [data, data.startDate, data.endDate])


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
                    "https://api.cloudinary.com/v1_1/dnzkakna0/image/upload",
                    data, {
                    withCredentials: false
                }
                )
                const { url } = uploadRes.data;
                const { public_id } = uploadRes.data;
                const newevent = {
                    ...info, poster: url, cloud_id: public_id, startDate: start, endDate: end
                }


                axios.put(putURLs("events", id), newevent, {
                    withCredentials: false
                })
                navigate("/admin/events/new")

            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const newevent = {
                    ...info, startDate: start, endDate: end
                }
                await axios.put(`http://localhost:5500/api/events/${id}`, newevent, { withCredentials: false })
                navigate("/admin/events/new")
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    

    return (
        <div className="new">
            <div className="newContainer">
                <AdminNavbar />
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
                                <DatePicker
                                    class="date-picker"
                                    showTimeSelect
                                    placeholderText="Start Date"
                                    style={{ marginRight: "10px" }}
                                    selected={start}
                                    onChange={(start) => setStart(start)}
                                />
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
                                <button onClick={handleClick} className="form-btn">Edit Event</button>
                            </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditEvent;
