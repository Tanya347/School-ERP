import "../../config/style/form.scss"

import { useNavigate } from "react-router-dom";
import { useState } from 'react'

import { postURLs } from "../../config/endpoints/post";
import { createElement } from "../../config/service/usePost";
import { validateClass } from "../../config/validators/class";
import { handleChange as commonHandleChange } from "../../config/utils/commons";
import { classesConst, successMsg } from "../../config/utils/constants";

import Loader from "../../components/shared/loader/Loader";
import FormInputs from "../../components/shared/formInputs/FormInputs";

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
            const res = await createElement(info, postURLs(classesConst, "normal"), "Class")
            if(res.data.status === successMsg) {
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
            <div className="new-container">
                <div className="top">
                    <h1>{title}</h1>
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
                        </form>
                        <div className="submit-button">
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