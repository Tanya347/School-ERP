import { useNavigate } from "react-router-dom";
import "../../config/style/form.scss"
import { createElement } from "../../config/service/usePost";
import { useState } from 'react'
import { postURLs } from "../../config/endpoints/post";
import Loader from "../../components/shared/loader/Loader";
import { validateClass } from "../../config/validators/class";
import { handleChange as commonHandleChange } from "../../config/commons";

const CreateClass = ({ inputs, title}) => {
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        commonHandleChange(e, setInfo, setErrors, validateClass);
    }

    const handleClear = (e) => {
        e.preventDefault();
        setInfo({});
        setErrors({});
    }

    const handleClick = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const res = await createElement(info, postURLs("classes", "normal"), "Class")
            if(res.data.status === 'success') {
                navigate('/admin/classes');
            }
        } catch(err) {
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
                            {inputs?.map((input) => (
                                <div className="formInput" key={input.id}>
                                <label>{input.label}</label>
                                <input
                                    id={input.id}
                                    onChange={handleChange}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    className={errors[input.id] ? "error-input" : ""}
                                />
                                {errors[input.id] && <span className="error-message">{errors[input.id]}</span>}
                                </div>
                            ))}
                        </form>
                        <div className="submitButton">
                            {loading && <Loader text="Creating Class..." />}
                            <button className="clear-btn" onClick={handleClear}>Clear</button>
                            <button onClick={handleClick} className="form-btn">Create Class</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateClass