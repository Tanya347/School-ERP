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

const EditEvent = ({ inputs, title }) => {
    const location = useLocation();
    const id = location.pathname.split("/")[4];
    const [info, setInfo] = useState({});
    const [file, setFile] = useState("");
    const { data } = useFetch(getSingleData(id, "events"))

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

                            <DatePicker
                                class="date-picker"
                                showTimeSelect
                                placeholderText="Start Date"
                                style={{ marginRight: "10px" }}
                                selected={start}
                                onChange={(start) => setStart(start)}
                            />
                            <label><span style={{color: "green", fontWeight: "bold"}}>Original Date : </span >{new Date(info.startDate).toLocaleDateString()}
                                <span style={{color: "green", fontWeight: "bold"}}>   Original Time : </span>{s.getHours() >= 12 ? s.getHours() % 12 : s.getHours()} {s.getHours() >= 12 ? "PM" : "AM"}</label>

                            <DatePicker
                                class="date-picker"
                                showTimeSelect
                                placeholderText="End Date"
                                selected={end}
                                onChange={(end) => setEnd(end)}
                            />

                            <label><span style={{color: "green", fontWeight: "bold"}}>Original Date : </span>{new Date(info.endDate).toLocaleDateString()}
                                <span style={{color: "green", fontWeight: "bold"}}>    Original Date : </span>{e.getHours() >= 12 ? e.getHours() % 12 : e.getHours()} {e.getHours() >= 12 ? "PM" : "AM"}</label>

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
