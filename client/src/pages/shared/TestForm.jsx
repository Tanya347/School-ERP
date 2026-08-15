import "../../utils/style/form.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { postURLs } from "../../utils/endpoints/post";
import { putURLs } from "../../utils/endpoints/put";
import { createElement } from "../../utils/service/usePost";
import { editElement } from "../../utils/service/usePut";
import { validateTest } from "../../utils/validators/test";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { testsConst } from "../../utils/shared/constants";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import InlineError from "../../components/shared/inlineError/InlineError";

const TestForm = ({ mode, inputs, title }) => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(null);
  const [sclass, setSclass] = useState("");
  const [course, setCourse] = useState("");

  const { id: mainId, testId } = useParams();
  const id = mainId || testId;
  const navigate = useNavigate();
  const classes = useSelector(state => state.faculty.classes);
  const courses = useSelector(state => state.faculty.courses);
  const { user } = useSelector(state => state.auth);

  // For Edit mode: fetch data
  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, testsConst) : null
  );

  useEffect(() => {
    if (mode === "edit" && data) {
      setInfo(data);
      if (data?.date) {
        setDate(new Date(data.date));
      }
      setSclass(data.classID?._id || "");
      setCourse(data.subject?._id || "");
    }
  }, [data, mode]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateTest);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const newtest = {
          ...info,
          date: date,
          author: user?._id,
        };
        const res = await createElement(newtest, postURLs(testsConst, "normals"), "Test");
        if (checkSuccess(res.data.status)) {
          navigate("/faculty/tests");
        }
      } else {
        const newInfo = {
          ...info,
          date: date,
          classID: sclass || info.classID?._id,
          subject: course || info.subject?._id,
        };
        const res = await editElement(newInfo, putURLs(testsConst, id), "test");
        if (checkSuccess(res.data.status)) {
          navigate("/faculty/tests");
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
    setDate(null);
    setSclass("");
    setCourse("");
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading test data"
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
                title="Choose a Course"
                options={courses}
                value={mode === "edit" ? (course || info?.subject?._id || "") : course}
                onChange={(e) => {
                  handleChange(e);
                  setCourse(e.target.value);
                }}
                getLabel={(course) => `${course.classID?.name} ${course.name}`}
              />
              <div className="form-input">
                <label>Set Test Date</label>
                <DatePickerComponent
                  selectedDate={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  placeholder="Choose Date and Time"
                  label="Select Date and Time"
                />
              </div>
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "Creating Test..." : "Editing Test..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button
                onClick={handleClick}
                disabled={loading}
                className="form-btn"
              >
                {mode === "create" ? "Create Test" : "Edit Test"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestForm;
