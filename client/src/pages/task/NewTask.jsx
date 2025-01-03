import "../../config/style/form.scss";

import { createElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../config/context/AuthContext";
import { getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import Dropdown from "../../components/dropdown/Dropdown";
import DatePickerComponent from "../../components/datepicker/Datepicker";

const NewTask = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(new Date());
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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
        ...info, deadline: deadline, author: user._id, 
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

              <Dropdown
                id="sclass"
                title="Choose Class"
                url={getFacultyData(user._id, "classes")}
                onChange={handleChange}
              />
                
              <div className="formInput">

                <DatePickerComponent
                  selectedDate={deadline}
                  onChange={(deadline) => setDeadline(deadline)}
                  placeholder="Deadline"
                  label="Set Deadline"
                  showTimeSelect={false}
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
