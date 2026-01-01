import "../../config/style/form.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses, getFacultyData } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { createElement } from "../../config/service/usePost";
import Dropdown from "../../components/shared/dropdown/Dropdown";
import { useAuth } from "../../config/context/AuthContext";
import Loader from "../../components/shared/loader/Loader";
import { handleChange as commonHandleChange } from "../../config/commons";
import { validateUpdate } from "../../config/validators/update";

const NewUpdate = ({ inputs }) => {
  const [info, setInfo] = useState({});
  const [noticeType, setNoticeType] = useState("general");
  const [sclass, setSclass] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateUpdate);
  };

  const handleClick = async (e) => {

    e.preventDefault();
    setLoading(true);

    // Prepare the payload, omitting 'class' if not needed
    let payload = {
      ...info,
      author: user._id
    };

    // If updateType is 'general', remove 'class' field
    if (payload.updateType === "general") {
      delete payload.class;
    }

    try {
      const res = await createElement(user.role === "admin" ? info : payload, postURLs("updates", "normal"), "Update");
      if(res.data.status === 'success') {
        navigate(`/${user.role}/updates`)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setNoticeType("general");
    setErrors({});
    setSclass("");
  }

  // Ensure noticeType is always reflected in info.updateType
  // Sync noticeType and info.updateType whenever noticeType changes
  // This effect will run when noticeType changes

  console.log(info)

  useEffect(() => {
    setInfo((prev) => ({
      ...prev,
      updateType: noticeType,
    }));
    // If switching to general, clear class selection
    if (noticeType === "general") {
      setSclass("");
      setInfo((prev) => ({
        ...prev,
        class: "",
      }));
    }
  }, [noticeType]);

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>Add New Update</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {inputs?.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    value={info[input.id] || ""}
                    className={errors[input.id] ? "error-input" : ""}
                  />
                  {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                </div>
              ))}

            <Dropdown
              id="updateType"
              title="Choose Notice Type"
              options={[
                { _id: 'general', name: 'General' },
                { _id: 'specific', name: 'Specific' },
              ]}
              value={noticeType}
              onChange={(e) => {
                handleChange(e);
                setNoticeType(e.target.value);
              }}
            />

                {noticeType && noticeType === "specific" && 
                  <div className="formInput">
                    {user.role === 'admin' ? (
                      <Dropdown
                        id="class"
                        title="Choose Class"
                        url={getClasses}
                        onChange={(e) => {
                          handleChange(e);
                          setSclass(e.target.value);
                        }}
                        value={sclass}
                      />
                    ) : (
                      <Dropdown
                        id="class"
                        title="Choose Class"
                        url={getFacultyData(user._id, "classes")}
                        onChange={(e) => {
                          handleChange(e);
                          setSclass(e.target.value);
                        }}
                        value={sclass}
                      />
                    )}
                  </div>
                }

            </form>
            <div className="submitButton">
              {loading && <Loader text="Creating Update..." />}
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button onClick={handleClick} className="form-btn">Create Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUpdate;
