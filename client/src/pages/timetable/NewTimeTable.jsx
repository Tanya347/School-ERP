import "../../style/form.scss"

import { useEffect, useState, useContext } from "react"

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import DatePicker from "react-datepicker";

import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar"
import { departments, semesters } from "../../source/formsource/arrays";
import { useNavigate } from "react-router-dom";
import { isMonday } from "date-fns";

const NewTimeTable = ({inputs, title}) => {

    const [info, setInfo] = useState({});
    const [lectures, setLectures] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });

    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    const handleClick = async(e) => {
        e.preventDefault();

        try {

        } catch(err) {
            console.log(err)
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
                        <form >
                            
                            <div className="formInput">
                                <label>Choose Department</label>
                                <select id="department" onChange={handleChange}>
                                    <option value={"-"}> </option>
                                    {
                                        departments.map((d) => (
                                        <option value={d.name} key={d.id}>{d.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="formInput">
                                <label>Semester</label>
                                <select
                                id="semester"
                                onChange={handleChange}
                                >
                                <option value={0}>-</option>
                                {
                                    semesters.map((s) => (
                                    <option value={s.id} key={s.id}>{s.name}</option>
                                    ))
                                }
                                </select>
                            </div>   

                            <h3>Schedule</h3>  
                            
                            <label>Monday</label>
                            <div className="formInput">
                                <DatePicker 
                                    showTimeSelect
                                    placeholderText="Start Time"
                                    // selected={isMonday}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewTimeTable



