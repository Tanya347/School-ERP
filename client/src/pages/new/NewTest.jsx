import "../../config/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { postURLs } from "../../config/endpoints/post";
import { createElement } from "../../config/service/usePost";
import { handleChange as commonHandleChange } from "../../config/utils/commons";
import { validateTest } from "../../config/validators/test";
import { successMsg, testsConst } from "../../config/utils/constants";

import Loader from "../../components/shared/loader/Loader";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import FormInputs from "../../components/shared/formInputs/FormInputs";

const NewTest = ({ inputs, title }) => {
  
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("")
  const [errors, setErrors] = useState({});
  const [studentClass, setStudentClass] = useState("");
  const [subject, setSubject] = useState("");
  
  const navigate = useNavigate();
  
  const { user } = useSelector(state => state.auth);
  const courses = useSelector(state => state.faculty.courses);
  const classes = useSelector(state => state.faculty.classes);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateTest);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
      try {
        const newtest = {
          ...info, date: start, author: user._id
        }
        const res = await createElement(newtest, postURLs(testsConst, "normals"), "Test");
        if(res.data.status === successMsg) {
          navigate("/faculty/tests");
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    } 

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setErrors({});
    setSubject("");
    setStudentClass("");
    setStart("");
  }
 
  return (

    <div className="new">
      <div className="new-container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="top">
          <div className="right">
            <form>

              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />

              <Dropdown
                id="subject"
                title="Select Course"
                options={courses}
                onChange={(e) => {
                  handleChange(e);
                  setSubject(e.target.value);
                }}
                value={subject}
              />

              <Dropdown
                id="sclass"
                title="Select Class"
                options={classes}
                onChange={(e) => {
                  handleChange(e);
                  setStudentClass(e.target.value);
                }}
                value={studentClass}
              />

              <DatePickerComponent
                selectedDate={start}
                onChange={(date) => setStart(date)}
                placeholder="Date and Time"
                label="Select Date and Time"
              />
            
            </form>
            <div className="submit-button">
            {loading && <Loader text="Creating Test..." />}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleClick} className="form-btn">Create Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTest;