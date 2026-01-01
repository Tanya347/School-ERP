import "../../config/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { useAuth } from "../../config/context/AuthContext";
import Loader from "../../components/shared/loader/Loader";
import { createElement } from "../../config/service/usePost";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import { handleChange as commonHandleChange } from "../../config/commons";
import { validateTest } from "../../config/validators/test";

const NewTest = ({ inputs, title }) => {
  
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("")
  const [errors, setErrors] = useState({});
  const [studentClass, setStudentClass] = useState("");
  const [subject, setSubject] = useState("");
  
  const { user } = useAuth();
  const navigate = useNavigate();

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
        const res = await createElement(newtest, postURLs("tests", "normals"), "Test");
        if(res.data.status === 'success') {
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
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="top">
          <div className="right">
            <form>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    value={info[input.id] || ""}
                    className={errors[input.id] ? "error-input" : ""}
                  />
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                </div>
              ))}

              <Dropdown
                id="subject"
                title="Select Course"
                url={getFacultyData(user._id, "courses")}
                onChange={(e) => {
                  handleChange(e);
                  setSubject(e.target.value);
                }}
                value={subject}
              />

              <Dropdown
                id="sclass"
                title="Select Class"
                url={getFacultyData(user._id, "classes")}
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
            <div className="submitButton">
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