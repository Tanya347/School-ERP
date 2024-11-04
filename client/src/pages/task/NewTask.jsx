import "../../config/style/form.scss";

import { createElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ClipLoader } from "react-spinners";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../config/context/AuthContext";
import useFetch from "../../config/service/useFetch";
import { getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";

const NewTask = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(new Date());
  const [sclass, setSclass] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const classes = useFetch(getFacultyData(user._id, "classes")).data

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    const button = document.getElementsByClassName("form-btn")
    button.disabled = "true"
    setLoading(true)
    e.preventDefault();
    try {
      const newtask = {
        ...info, deadline: deadline, author: user._id, sclass: sclass 
      }
      const res = await createElement(newtask, postURLs("tasks", "normal"), "Task");
      if(res.data.status === 'success') {
        navigate("/faculty/tasks")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="new">

      <div className="newContainer">
        <Navbar />
        
        <div className="top">
          <h1>{title}</h1>
        </div>
        
        <div className="bottom">
          <div className="right">
            <form>

              {inputs?.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Choose a Class</label>
                <select
                  onChange={(e) => setSclass(e.target.value)}
                  id="classId">
                    <option>-</option>
                    {
                      classes && classes.length > 0 &&
                      classes?.map((cl, index) => (
                        <option key={index} value={cl._id}>{cl.name}</option>
                      ))
                    }
                </select>
              </div>
                
              <div className="formInput">

                <label>Set Deadline</label>
                <DatePicker
                  class="date-picker"
                  placeholderText="Choose Date and Time"
                  style={{ marginRight: "10px" }}
                  selected={deadline}
                  className="formInput"
                  onChange={(deadline) => setDeadline(deadline)}
                />
              </div>

            </form>
            <div className="submitButton">
            {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing update...
              </div>}
              <button onClick={handleClick} className="form-btn">Create Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
