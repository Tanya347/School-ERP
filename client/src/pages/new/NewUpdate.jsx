import "../../config/style/form.scss";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { postURLs } from "../../config/endpoints/post";
import { createElement } from "../../config/service/usePost";
import { handleChange as commonHandleChange } from "../../config/utils/commons";
import { validateUpdate } from "../../config/validators/update";
import { selectAvailableClasses } from "../../config/store/selectors/classSelectors";
import { noticeTypes, roles, successMsg, updatesConst } from "../../config/utils/constants";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";

const NewUpdate = ({ inputs }) => {
  const [info, setInfo] = useState({});
  const [noticeType, setNoticeType] = useState("general");
  const [sclass, setSclass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const classes = useSelector(selectAvailableClasses);

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
      const res = await createElement(user.role === roles.admin ? info : payload, postURLs(updatesConst, "normal"), "Update");
      if(res.data.status === successMsg) {
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
      <div className="new-container">
        <div className="top">
          <h1>Add New Update</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              <FormInputs
                inputs={inputs}
                values={info}
                errors={errors}
                onChange={handleChange}
              />

            <Dropdown
              id="updateType"
              title="Choose Notice Type"
              options={noticeTypes}
              value={noticeType}
              onChange={(e) => {
                handleChange(e);
                setNoticeType(e.target.value);
              }}
            />

            {noticeType && noticeType === "specific" && 
              <Dropdown
                id="class"
                title="Choose Class"
                options={classes}
                value={sclass}
                onChange={(e) => {
                  setSclass(e.target.value);
                  setInfo(prev => ({ ...prev, class: e.target.value }));
                }}
              />
            }

            </form>
            <div className="submit-button">
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
