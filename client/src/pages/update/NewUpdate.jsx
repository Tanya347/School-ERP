import "../../style/form.scss";

import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import Navbar from "../../components/navbar/Navbar";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const NewUpdate = ({ inputs, type }) => {
  const [info, setInfo] = useState({});
  const [noticeType, setNoticeType] = useState("");
  const classes = useFetch('/classes').data
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {

    e.preventDefault();

    try {
      const newupdate = {
        ...info, updateType: noticeType
      }
      await axios.post("http://localhost:5500/api/updates", newupdate, {
        withCredentials: false
      })
      navigate(-1)
    } catch (err) {
      console.log(err)
    }
  }

  

  return (
    <div className="new">
      <div className="newContainer">
        {type === "Admin" ? <AdminNavbar /> : <Navbar />}
        <div className="top">
          <h1>Add New Update</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}


                <div className="formInput">
                  <label>Choose Notice Type</label>
                  <select
                    onChange={(e) => setNoticeType(e.target.value)}
                    id="classId">
                      <option key={1} value="general">General</option>
                      <option key={2} value="specific">Specific</option>
                  </select>
                </div>

                {noticeType && noticeType === "specific" && 
                  <div className="formInput">
                    <label>Choose a Class</label>
                    <select
                      id="class"
                      onChange={handleChange}
                    >
                      <option value={"-"}> </option>
                      {
                        classes&& classes.map((c, index) => (
                          <option value={c._id} key={index}>{c.name}</option>
                        ))
                      }
                    </select>
                  </div>
                }

            </form>
            <div className="submitButton">
              <button onClick={handleClick} class="form-btn">Create Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUpdate;
