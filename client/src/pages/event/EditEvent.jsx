import "./editEvent.scss";
import Navbar from "../../components/adminNavbar/AdminNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import useFetch from "../../hooks/useFetch";

const EditEvent = ({ inputs, title }) => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [info, setInfo] = useState({});
    const [file, setFile] = useState("");
    const { data } = useFetch(`/events/${id}`)

    const navigate = useNavigate();


    useEffect(() => {
        setInfo(data)
    }, [data])

    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")

    const s = new Date(info.startDate);
    const e = new Date(info.endDate)


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
                    ...info, poster: url, cloud_id: public_id
                }

                axios.put(`http://localhost:5500/api/events/${id}`, newevent, {
                    withCredentials: false
                })
                navigate(-1)

            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await axios.put(`http://localhost:5500/api/events/${id}`, info, { withCredentials: false })
                navigate(-1)
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className="editEvent">
            <div className="editEventContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                (file)
                                    ? URL.createObjectURL(file)
                                    : (info.poster) ? info.poster : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
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

                            <DatePicker
                                class="date-picker"
                                showTimeSelect
                                placeholderText="Start Date"
                                style={{ marginRight: "10px" }}
                                selected={start}
                                onChange={(start) => setStart(start)}
                            />
                            <label><span>Original Date : </span>{s.getDate()} / {s.getMonth()} / {s.getFullYear()}
                                <span>   Original Time : </span>{s.getHours() >= 12 ? s.getHours() % 12 : s.getHours()} {s.getHours() >= 12 ? "PM" : "AM"}</label>

                            <DatePicker
                                class="date-picker"
                                showTimeSelect
                                placeholderText="End Date"
                                selected={end}
                                onChange={(end) => setEnd(end)}
                            />

                            <label><span>Original Date : </span>{e.getDate()} / {e.getMonth()} / {e.getFullYear()}
                                <span>    Original Date : </span>{e.getHours() >= 12 ? e.getHours() % 12 : e.getHours()} {e.getHours() >= 12 ? "PM" : "AM"}</label>

                            {inputs.map((input) => (
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
                            <div className="submitButton">
                                <button onClick={handleClick} id="submit">Edit Event</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditEvent;
