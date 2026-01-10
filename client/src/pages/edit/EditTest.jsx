import "../../utils/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { putURLs } from "../../utils/endpoints/put";
import { editElement } from "../../utils/service/usePut";
import { testInputs } from "../../utils/formsource/testInputs";
import { validateTest } from "../../utils/validators/test";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { testsConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader"
import FormInputs from "../../components/shared/formInputs/FormInputs"
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditTest = ({ title }) => {
  
  const [date, setDate] = useState(null);
  const [sclass, setSclass] = useState("");
  const [course, setCourse] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  // get location and extract id out of it
  const id = location.pathname.split("/")[4];
  
  const classes = useSelector(state => state.faculty.classes);
  const courses = useSelector(state => state.faculty.courses);
  const { data } = useFetch(getSingleData(id, testsConst))

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
  
    setInfo(data)
    if(data.date)
      setDate(new Date(data?.date)); 
  }, [data, data.date])

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateTest);
  }

  // update the data in the data base using put method
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(date)
        info.date = date
      if(sclass)
        info.classID = sclass
      if(course)
        info.subject = course

      const res = await editElement(info, putURLs(testsConst, id), "test")
      if(checkSuccess(res.data.status)) {
        navigate("/faculty/tests")
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
              inputs={testInputs}
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


              <Dropdown
                title="Choose a Course"
                options={courses}
                value={course || info?.subject?._id || ""}
                onChange={(e) => setCourse(e.target.value)}
              />


              <div className="form-input">

                <label>Set Test Date</label>
                <DatePicker
                  class="date-picker"
                  placeholderText="Choose Date and Time"
                  style={{ marginRight: "10px" }}
                  selected={date}
                  className="form-input"
                  onChange={(selectedDate) => {
                    // Set only the date part to the state
                    const dateWithoutTime = new Date(selectedDate.setHours(0, 0, 0, 0));
                    setDate(dateWithoutTime);
                  }}
                  />
              </div>
                  </form>

            {/* Submit Button */}
            <div className="submit-button">
            {loading && <Loader text="editing test..."/>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTest;
