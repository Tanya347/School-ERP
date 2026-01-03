import "../../config/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { createElement } from "../../config/service/usePost";
import { getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { validateTask } from "../../config/validators/task";
import { handleChange as commonHandleChange } from "../../config/commons";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import Loader from "../../components/shared/loader/Loader";

const NewTask = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(new Date());
  const { user } = useSelector(state => state.auth);
  const [errors, setErrors] = useState({});
  const [studentClass, setStudentClass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateTask);
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

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setErrors({});
    setStudentClass("");
    setDeadline(new Date());
  }

  return (
    <div className="new">

      <div className="new-container">
        
        <div className="top">
          <h1>{title}</h1>
        </div>
        
        <div className="bottom">
          <div className="right">
            <form>

              {inputs?.map((input) => (
                <div className="form-input" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={info[input.id] || ""}
                    className={errors[input.id] ? "error-input" : ""}
                  />
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                </div>
              ))}

              <Dropdown
                id="sclass"
                title="Choose Class"
                url={getFacultyData(user._id, "classes")}
                onChange={(e) => {
                  handleChange(e);
                  setStudentClass(e.target.value);
                }}
                value={studentClass}
              />
                
              <div className="form-input">

                <DatePickerComponent
                  selectedDate={deadline}
                  onChange={(deadline) => setDeadline(deadline)}
                  placeholder="Deadline"
                  label="Set Deadline"
                  showTimeSelect={false}
                />
              </div>

            </form>
            <div className="submit-button">
              {loading && <Loader text="Creating Task..." />}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleClick} className="form-btn">Create Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
