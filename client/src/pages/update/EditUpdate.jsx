import "../../config/style/form.scss";

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../config/service/useFetch";
import { getClasses, getSingleData } from "../../config/endpoints/get";
import { putURLs } from "../../config/endpoints/put";
import { editElement } from "../../config/service/usePut";
import { updateInputs } from "../../config/formsource/updateInputs";

const EditUpdate = ({ title, type }) => {

  const [noticeType, setNoticeType] = useState("");
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const { data } = useFetch(getSingleData(id, "updates"))
  const classes = useFetch(getClasses).data


  const [info, setInfo] = useState({});

  useEffect(() => {
    setInfo(data)
    setNoticeType(data.updateType)
  }, [data])

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      if(noticeType === "general")
        info.class = null
      
      const newupdate = {
        ...info, updateType: noticeType
      }


      const res = await editElement(newupdate, putURLs("updates", id), "update");

      if(res.data.status === 'success') {
        navigate("/admin/updates")
      }
    } catch (err) {
      console.log(err)
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
                    onChange={(e) => setNoticeType(e.target.value)}
                    id="classId">
                      <option key={1} value="general" selected={info?.updateType === "general"}>General</option>
                      <option key={2} value="specific" selected={info?.updateType === "specific"}>Specific</option>
                  </select>
              </div>

              {noticeType === "specific" && <div className="formInput">
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
              <button onClick={handleClick} id="submit" className="form-btn">Edit Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUpdate;
