import "../../config/style/form.scss";

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../config/service/useFetch";
import { getClasses, getFacultyData, getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { editElement } from "../../config/service/usePut";
import { updateInputs } from "../../config/formsource/updateInputs";
import { useAuth } from "../../config/context/AuthContext";
import { ClipLoader } from "react-spinners";

const EditUpdate = ({ title }) => {

  const [noticeType, setNoticeType] = useState("general");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const id = location.pathname.split("/")[4];
  const {user} = useAuth();
  const { data } = useFetch(getSingleData(id, "updates"))
  let path;
  if(user.role === 'faculty') {
    path = getFacultyData(user._id, "classes")
  } else {
    path = getClasses
  }
  const classes = useFetch(path).data


  const [info, setInfo] = useState({});

  useEffect(() => {
    setInfo(data)
    setNoticeType(data.updateType)
  }, [data])

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if(e.target.id === 'updateType') {
      setNoticeType(e.target.value)
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(noticeType === "general")
        info.class = null

      const res = await editElement(info, putURLs("updates", id), "update");

      if(res.data.status === 'success') {
        navigate(`/${user.role}/updates`)
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

        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>

              {updateInputs.map((field) => (
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
                  <label>Choose Notice Type</label>
                  <select
                    onChange={handleChange}
                    id="updateType">
                      <option key={1} value="general" selected={info?.updateType === "general"}>General</option>
                      <option key={2} value="specific" selected={info?.updateType === "specific"}>Specific</option>
                  </select>
              </div>

              {noticeType && noticeType === "specific" && <div className="formInput">
                <label>Class</label>
                <select
                  id="class"
                  onChange={handleChange}
                >
                  {
                    classes?.map((d, index) => (
                      <option value={d._id} key={index} selected={info?.class?._id === d._id}>{d.name}</option>
                    ))
                  }
                </select>
              </div>}
            </form>
            <div className="submitButton">
              {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing update...
              </div>}
              <button onClick={handleClick} id="submit" className="form-btn">Edit Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUpdate;
