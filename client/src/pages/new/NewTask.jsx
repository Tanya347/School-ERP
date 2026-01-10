import "../../utils/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { createElement } from "../../utils/service/usePost";
import { postURLs } from "../../utils/endpoints/post";
import { validateTask } from "../../utils/validators/task";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { tasksConst } from "../../utils/shared/constants";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";

const NewTask = ({ inputs, title }) => {

  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(new Date());
  const { user } = useSelector(state => state.auth);
  const [errors, setErrors] = useState({});
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);

  const courses = useSelector(state => state.faculty.courses);

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
      const res = await createElement(newtask, postURLs(tasksConst, "normal"), "Task");
      if(checkSuccess(res.data.status)) {
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
    setCourse("");
    setDeadline(new Date());
  }

  return (
    <div className="new">

      <div className="new-container">
        
        <div className="top">
          <h1>{title}</h1>
        </div>
        
        <div className="bottom">
          <div className="form-container">
            <form>

              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />

              <Dropdown
                id="courseID"
                title="Choose Course"
                options={courses}
                onChange={(e) => {
                  handleChange(e);
                  setCourse(e.target.value);
                }}
                value={course}
                getLabel={(course) => `${course.classID?.name} ${course.name}`}
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
