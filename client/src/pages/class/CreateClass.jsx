import { useNavigate } from "react-router-dom";
import "../../config/style/form.scss"
import { ClipLoader } from "react-spinners";
import { createElement } from "../../config/service/usePost";

import React, { useState } from 'react'
import { postURLs } from "../../config/endpoints/post";

const CreateClass = ({ inputs, title}) => {
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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
                                />
                                </div>
                            ))}
                        </form>
                        <div className="submitButton">
                            {loading && <div className="create-loader">
                                <ClipLoader color="black" size={30} />
                                    creating class...
                                </div>}
                            <button onClick={handleClick} className="form-btn">Create Task</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateClass