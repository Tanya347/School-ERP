import "../../config/style/form.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../../config/endpoints/get";
import { postURLs } from "../../config/endpoints/post";
import { createElement } from "../../config/service/usePost";
import { ClipLoader } from "react-spinners";
import Dropdown from "../../components/dropdown/Dropdown";

const NewUpdate = ({ inputs }) => {
  const [info, setInfo] = useState({});
  const [noticeType, setNoticeType] = useState("general");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      const res = await createElement(info, postURLs("updates", "normal"), "Update");
      if(res.data.status === 'success') {
        navigate("/admin/updates")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  console.log(info)
  

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
                  />
                </div>
              ))}

            <Dropdown
              id="updateType"
              title="Choose Notice Type"
              options={[
                { value: 'general', label: 'General' },
                { value: 'specific', label: 'Specific' },
              ]}
              onChange={handleChange}
            />

                {noticeType && noticeType === "specific" && 
                  <Dropdown
                    id="class"
                    title="Choose Class"
                    url={getClasses}
                    onChange={handleChange}
                  />
                }

            </form>
            <div className="submitButton">
              {loading && <div className="create-loader">
                <ClipLoader color="black" size={30} />
                editing update...
              </div>}
              <button onClick={handleClick} class="form-btn">Create Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUpdate;
