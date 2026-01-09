import "../../utils/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { postURLs } from "../../utils/endpoints/post";
import { createElement } from "../../utils/service/usePost";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { validateTest } from "../../utils/validators/test";
import { testsConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import DatePickerComponent from "../../components/shared/datepicker/Datepicker";
import FormInputs from "../../components/shared/formInputs/FormInputs";

const NewTest = ({ inputs, title }) => {
  
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("")
  const [errors, setErrors] = useState({});
  const [subject, setSubject] = useState("");
  
  const navigate = useNavigate();
  
  const { user } = useSelector(state => state.auth);
  const courses = useSelector(state => state.faculty.courses);

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
        if(checkSuccess(res.data.status)) {
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
    setStart("");
  }
 
  return (

    <div className="new">
      <div className="new-container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="top">
          <div className="form-container">
            <form>

              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />
                
              <DatePickerComponent
                selectedDate={start}
                onChange={(date) => setStart(date)}
                placeholder="Date and Time"
                label="Select Date and Time"
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