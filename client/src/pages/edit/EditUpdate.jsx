import "../../utils/style/form.scss";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import useFetch from "../../utils/service/useFetch";
import { getSingleData } from "../../utils/endpoints/get";
import { selectAvailableClasses } from "../../utils/store/selectors/classSelectors";
import { putURLs } from "../../utils/endpoints/put";
import { editElement } from "../../utils/service/usePut";
import { updateInputs } from "../../utils/formsource/updateInputs";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { validateUpdate} from "../../utils/validators/update";
import { noticeTypes, updatesConst } from "../../utils/shared/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs"
import Dropdown from "../../components/shared/dropdown/Dropdown";

const EditUpdate = ({ title }) => {

  const [noticeType, setNoticeType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[4];

  const { user } = useSelector(state => state.auth);
  const { data } = useFetch(getSingleData(id, updatesConst))
  const classes = useSelector(selectAvailableClasses);

  useEffect(() => {
    if(!data) return;

    setInfo(data)
    setNoticeType(data.updateType)

    if (data.class) {
      setSelectedClass(data.class._id || data.class);
    }
  }, [data])


  const handleChange = (e) => {
    commonHandleChange(e, setInfo, setErrors, validateUpdate)
    if(e.target.id === 'updateType') {
      setNoticeType(e.target.value)
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (noticeType === "general") {
        info.class = null;
      } else {
        info.class = selectedClass;
      }

      const res = await editElement(info, putURLs("updates", id), "update");

      if(checkSuccess(res.data.status)) {
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
      {loading ? (
        <Loader text="Loading data..." type="global" />
      ) : (
        <>
          <div className="new-container">
            <div className="top">
              <h1>{title}</h1>
            </div>
            <div className="bottom">
              <div className="form-container">
                <form>

                  <FormInputs
                    inputs={updateInputs}
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
                      id="class"
                      title="Choose Class"
                      options={classes}
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setInfo(prev => ({ ...prev, class: e.target.value }));
                      }}
                    />
                  )}

                </form>
                <div className="submit-button">
                  {loading && <Loader text="editing update..."/>}
                  <button onClick={handleClick} id="submit" className="form-btn">Edit Update</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditUpdate;
