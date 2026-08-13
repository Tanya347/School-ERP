import "../../utils/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import InlineError from "../../components/shared/inlineError/InlineError";

const EditTask = ({ title }) => {

  const [info, setInfo] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [sclass, setSclass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  const classes = useSelector(state => state.faculty.classes);
  const { data, loading: fetchLoading, error, reFetch } = useFetch(getSingleData(id, tasksConst));

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
    setInfo(data)
    if(data?.deadline)
      setDeadline(new Date(data.deadline))
  }, [data])

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
        info.classID = sclass

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
      {fetchLoading ? (
        <Loader text="Loading data..." type="global" />
      ) : error ? (
        <InlineError
          title="Error loading task data"
          message={error.response?.data?.message || error.message}
          onRetry={reFetch}
        />
      ) : (
        <div className="new-container">
          <div className="top">
            <h1>{title}</h1>
          </div>

          <div className="bottom">
            <div className="form-container">
              <form>
                <FormInputs
                  inputs={taskInputs}
                  values={info}
                  errors={errors}
                  onChange={handleChange}
                  type="edit"
                />

                <Dropdown
                  title="Choose a Class"
                  options={classes}
                  value={sclass || info?.classID?._id || ""}
                  onChange={(e) => setSclass(e.target.value)}
                />

                <div className="form-input">
                  <label>Set Deadline</label>
                  <DatePicker
                    className="date-picker form-input"
                    placeholderText="Choose Date and Time"
                    style={{ marginRight: "10px" }}
                    selected={deadline}
                    onChange={(selectedDate) => {
                      const dateWithoutTime = new Date(selectedDate.setHours(0, 0, 0, 0));
                      setDeadline(dateWithoutTime);
                    }}
                  />
                </div>
              </form>

              <div className="submit-button">
                {loading && <Loader text="editing task..." />}
                <button onClick={handleClick} id="submit" className="form-btn">Edit Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;
