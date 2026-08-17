import "../../utils/style/form.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { postURLs } from "../../utils/endpoints/post";
import { putURLs } from "../../utils/endpoints/put";
import { createElement } from "../../utils/service/postHelper";
import { editElement } from "../../utils/service/putHelper";
import { validateTask } from "../../utils/validators/task";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { tasksConst } from "../../utils/shared/constants";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import InlineError from "../../components/shared/inlineError/InlineError";

const TaskForm = ({ mode, inputs, title }) => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [sclass, setSclass] = useState("");
  const [course, setCourse] = useState("");

  const { id: mainId, taskId } = useParams();
  const id = mainId || taskId;
  const navigate = useNavigate();
  const classes = useSelector(state => state.faculty.classes);
  const courses = useSelector(state => state.faculty.courses);
  const { user } = useSelector(state => state.auth);

  // For Edit mode: fetch data
  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, tasksConst) : null
  );

  useEffect(() => {
    if (mode === "edit" && data) {
      setInfo(data);
      if (data?.deadline) {
        setDeadline(new Date(data.deadline));
      }
      setSclass(data.classID?._id || "");
      setCourse(data.courseID?._id || "");
    }
  }, [data, mode]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateTask);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const newtask = {
          ...info,
          deadline: deadline,
          author: user?._id,
        };
        const res = await createElement(newtask, postURLs(tasksConst, "normal"), "Task");
        if (checkSuccess(res.data.status)) {
          navigate("/faculty/tasks");
        }
      } else {
        const newInfo = {
          ...info,
          deadline: deadline,
          classID: sclass || info.classID?._id,
          courseID: course || info.courseID?._id,
        };
        const res = await editElement(newInfo, putURLs("tasks", id), "task");
        if (checkSuccess(res.data.status)) {
          navigate("/faculty/tasks");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setErrors({});
    setDeadline(null);
    setSclass("");
    setCourse("");
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading task data"
        message={error.response?.data?.message || error.message}
        onRetry={reFetch}
      />
    );
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
                type={mode === "edit" ? "edit" : "create"}
              />
              <Dropdown
                title="Choose a Class"
                options={classes}
                value={mode === "edit" ? (sclass || info?.classID?._id || "") : sclass}
                onChange={(e) => {
                  handleChange(e);
                  setSclass(e.target.value);
                }}
              />
              <Dropdown
                id="courseID"
                title="Choose Course"
                options={courses}
                value={mode === "edit" ? (course || info?.courseID?._id || "") : course}
                onChange={(e) => {
                  handleChange(e);
                  setCourse(e.target.value);
                }}
                getLabel={(course) => `${course.classID?.name} ${course.name}`}
              />
              <div className="form-input">
                <label>Set Deadline</label>
                <DatePickerComponent
                  selectedDate={deadline}
                  onChange={(selectedDate) => setDeadline(selectedDate)}
                  placeholder="Deadline"
                  label="Set Deadline"
                />
              </div>
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "Creating Task..." : "Editing Task..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button
                onClick={handleClick}
                disabled={loading}
                className="form-btn"
              >
                {mode === "create" ? "Create Task" : "Edit Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
