import "../../utils/style/form.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { postURLs } from "../../utils/endpoints/post";
import { putURLs } from "../../utils/endpoints/put";
import { createElement } from "../../utils/service/usePost";
import { editElement } from "../../utils/service/usePut";
import { validateUpdate } from "../../utils/validators/update";
import { checkAdmin, checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { noticeTypes, updatesConst } from "../../utils/shared/constants";
import { selectAvailableClasses } from "../../utils/store/selectors/classSelectors";

import Dropdown from "../../components/shared/dropdown/Dropdown";
import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";
import InlineError from "../../components/shared/inlineError/InlineError";

const UpdateForm = ({ mode, inputs, title }) => {
  const [info, setInfo] = useState({});
  const [noticeType, setNoticeType] = useState("general");
  const [sclass, setSclass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { id: mainId, updateId } = useParams();
  const id = mainId || updateId;
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const classes = useSelector(selectAvailableClasses);

  // For Edit mode: fetch data
  const { data, loading: fetchLoading, error, reFetch } = useFetch(
    mode === "edit" ? getSingleData(id, updatesConst) : null
  );

  useEffect(() => {
    if (mode === "edit" && data) {
      setInfo(data);
      setNoticeType(data.updateType || "general");
      if (data.classID) {
        setSclass(data.classID._id || data.classID);
      }
    }
  }, [data, mode]);

  useEffect(() => {
    setInfo((prev) => ({
      ...prev,
      updateType: noticeType,
    }));
    if (noticeType === "general") {
      setSclass("");
      setInfo((prev) => ({
        ...prev,
        classID: "",
      }));
    }
  }, [noticeType]);

  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateUpdate);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    let payload = {
      ...info,
      author: user._id,
    };

    if (noticeType === "general") {
      delete payload.classID;
      delete info.classID;
    } else {
      payload.classID = sclass || info.classID?._id;
    }

    try {
      const res = await (mode === "create"
        ? createElement(checkAdmin(user.role) ? info : payload, postURLs(updatesConst, "normal"), "Update")
        : editElement(payload, putURLs("updates", id), "update")
      );

      if (checkSuccess(res.data.status)) {
        navigate(`/${user.role}/updates`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInfo({});
    setNoticeType("general");
    setErrors({});
    setSclass("");
  };

  if (mode === "edit" && fetchLoading) {
    return <Loader text="Loading data..." type="global" />;
  }

  if (mode === "edit" && error) {
    return (
      <InlineError
        title="Error loading update data"
        message={error.response?.data?.message || error.message}
        onRetry={reFetch}
      />
    );
  }

  return (
    <div className="new">
      <div className="new-container">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="form-container">
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
              {noticeType === "specific" && (
                <Dropdown
                  id="classID"
                  title="Choose Class"
                  options={classes}
                  value={sclass}
                  onChange={(e) => {
                    setSclass(e.target.value);
                    setInfo(prev => ({ ...prev, classID: e.target.value }));
                  }}
                />
              )}
            </form>
            <div className="submit-button">
              {loading && <Loader text={mode === "create" ? "Creating Update..." : "Editing Update..."} />}
              {mode === "create" && <button className="clear-btn" onClick={handleClear}>Clear</button>}
              <button
                onClick={handleClick}
                disabled={loading}
                className="form-btn"
              >
                {mode === "create" ? "Create Update" : "Edit Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateForm;
