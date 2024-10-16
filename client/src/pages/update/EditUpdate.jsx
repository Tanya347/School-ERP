import "../../style/form.scss";

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import useFetch from "../../config/hooks/useFetch";

import AdminNavbar from "../../components/navbar/AdminNavbar";
import Navbar from "../../components/navbar/Navbar";
import { getClasses, getSingleData } from "../../source/endpoints/get";
import { putURLs } from "../../source/endpoints/put";

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


      await axios.put(putURLs("updates", id), newupdate, {
        withCredentials: false
      })
      navigate("/admin/updates")
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="new">
      <div className="newContainer">
      {type === "Admin" ? <AdminNavbar /> : <Navbar />}

        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>

              <div className="formInput">
                <label>Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  onChange={handleChange}
                  value={info.title}
                />
              </div>

              <div className="formInput">
                <label>Description</label>
                <input
                  id="desc"
                  type="text"
                  placeholder="Enter description"
                  onChange={handleChange}
                  value={info.desc}
                />
              </div>

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
