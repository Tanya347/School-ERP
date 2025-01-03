import "../../config/style/form.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { useAuth } from "../../config/context/AuthContext";
import { ClipLoader } from "react-spinners";
import { createElement } from "../../config/service/usePost";
import Dropdown from "../../components/dropdown/Dropdown";
import DatePickerComponent from "../../components/datepicker/Datepicker";


const NewTest = ({ inputs, title }) => {
  
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // dates
  const [start, setStart] = useState("")
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
      try {
        const newtest = {
          ...info, date: start, author: user._id
        }
        const res = createElement(newtest, postURLs("tests", "normals"), "Test");
        if(res.data.status === 'success') {
          navigate("/faculty/tests")
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
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
                  />
                </div>
              ))}

              <Dropdown
                id="subject"
                title="Select Course"
                url={getFacultyData(user._id, "courses")}
                onChange={handleChange}
              />

              <Dropdown
                id="sclass"
                title="Select Class"
                url={getFacultyData(user._id, "classes")}
                onChange={handleChange}
              />

              <DatePickerComponent
                selectedDate={start}
                onChange={(date) => setStart(date)}
                placeholder="Date and Time"
                label="Select Date and Time"
              />
            
            </form>
            <div className="submitButton">
            {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing update...
              </div>}
              <button onClick={handleClick} className="form-btn">Create Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTest;