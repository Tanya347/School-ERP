import "../../utils/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { putURLs } from "../../utils/endpoints/put";
import { editElement } from "../../utils/service/usePut";
import { taskInputs } from "../../utils/formsource/taskInputs";
import { validateTask } from "../../utils/validators/task";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { tasksConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader"
import FormInputs from "../../components/shared/formInputs/FormInputs"
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditTask = ({ title }) => {
  
  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [sclass, setSclass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[4];

  const classes = useSelector(state => state.faculty.classes);
  const { data } = useFetch(getSingleData(id, tasksConst));

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
    setInfo(data)
    if(data.deadline)
      setDeadline(new Date(data.deadline))
  }, [data, data.deadline])

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateTask)
  }

  // update the data in the data base using put method
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(deadline)
        info.deadline = deadline
      if(sclass)
        info.sclass = sclass

      const res = await editElement(info, putURLs("tasks", id), "task");

      if(checkSuccess(res.data.status)) {
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

      <div className="new-container">

        {/* Title of form */}
        <div className="top">
          <h1>{title}</h1>
        </div>

        {/* Form */}
        <div className="bottom">
          <div className="form-container">
            
            <form>
              <FormInputs
                inputs={taskInputs}
                values={info}
                errors={errors}
                onChange={handleChange}
            />
              
            <Dropdown
              title="Choose a Class"
              options={classes}
              value={sclass || info?.sclass?._id || ""}
              onChange={(e) => setSclass(e.target.value)}
            />


              <div className="form-input">

                <label>Set Deadline</label>
                <DatePicker
                  class="date-picker"
                  placeholderText="Choose Date and Time"
                  style={{ marginRight: "10px" }}
                  selected={deadline}
                  className="form-input"
                  onChange={(selectedDate) => {
                    // Set only the date part to the state
                    const dateWithoutTime = new Date(selectedDate.setHours(0, 0, 0, 0));
                    setDeadline(dateWithoutTime);
                  }}
                  />
              </div>
                  </form>

            {/* Submit Button */}
            <div className="submit-button">
            {loading && <Loader text="editing task..." />}
              <button onClick={handleClick} id="submit" className="form-btn">Edit Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
