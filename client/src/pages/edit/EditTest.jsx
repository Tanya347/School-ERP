import "../../config/style/form.scss";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import useFetch from "../../config/service/useFetch";
import { getFacultyData, getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { useAuth } from "../../config/context/AuthContext";
import { ClipLoader } from "react-spinners";
import { editElement } from "../../config/service/usePut";
import { testInputs } from "../../config/formsource/testInputs";


const EditTest = ({ title }) => {
  
  const [date, setDate] = useState(null);
  const [sclass, setSclass] = useState("");
  const [course, setCourse] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);


  const { user } = useAuth();

  // get location and extract id out of it
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  
  const classes = useFetch(getFacultyData(user._id, "classes")).data
  const courses = useFetch(getFacultyData(user._id, "courses")).data
  
  const { data } = useFetch(getSingleData(id, "tests"))


  const navigate = useNavigate();

  // data needs to be present in forms for it to change hence feed data into the array
  useEffect(() => {
  
    setInfo(data)
    if(data.date)
      setDate(new Date(data?.date)); 
  }, [data, data.date])

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  // update the data in the data base using put method
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(date)
        info.date = date
      if(sclass)
        info.sclass = sclass
      if(course)
        info.subject = course

      const res = await editElement(info, putURLs("tests", id), "test")
      if(res.data.status === 'success') {
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

      <div className="newContainer">

        {/* Title of form */}
        <div className="top">
          <h1>{title}</h1>
        </div>

        {/* Form */}
        <div className="bottom">
          <div className="right">
            
            <form>
            
            {testInputs.map((field) => (
                <div className="formInput" key={field.id}>
                  <label>{field.label}</label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    value={info[field.id] || ""}
                  />
                </div>
            ))}

            <div className="formInput">
                <label>Choose a Class</label>
                <select
                  onChange={(e) => setSclass(e.target.value)}
                  id="classId">
                    {
                      classes && classes.length > 0 &&
                      classes?.map((cl, index) => (
                        <option key={index} value={cl._id} selected={info?.sclass?._id === cl._id}>{cl.name}</option>
                        ))
                      }
                </select>
              </div>

              <div className="formInput">
                <label>Choose a Course</label>
                <select
                  onChange={(e) => setCourse(e.target.value)}
                  id="classId">
                    {
                      courses && courses.length > 0 &&
                      courses?.map((cr, index) => (
                        <option key={index} value={cr._id} selected={info?.subject?._id === cr._id}>{cr.name}</option>
                        ))
                      }
                </select>
              </div>

              <div className="formInput">

                <label>Set Test Date</label>
                <DatePicker
                  class="date-picker"
                  placeholderText="Choose Date and Time"
                  style={{ marginRight: "10px" }}
                  selected={date}
                  className="formInput"
                  onChange={(selectedDate) => {
                    // Set only the date part to the state
                    const dateWithoutTime = new Date(selectedDate.setHours(0, 0, 0, 0));
                    setDate(dateWithoutTime);
                  }}
                  />
              </div>
                  </form>

            {/* Submit Button */}
            <div className="submitButton">
            {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing update...
              </div>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTest;
