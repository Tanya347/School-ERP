import "../../utils/style/form.scss"

import { useNavigate } from "react-router-dom";
import { useState } from 'react'

import { postURLs } from "../../utils/endpoints/post";
import { createElement } from "../../utils/service/usePost";
import { validateClass } from "../../utils/validators/class";
import { checkSuccess, handleChange as commonHandleChange } from "../../utils/shared/commons";
import { classesConst } from "../../utils/shared/constants";

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
            if(checkSuccess(res.data.status)) {
                navigate('/admin/classes');
                window.location.reload();
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
                    <div className="form-container">
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