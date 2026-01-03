import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { useState } from "react";

import DatePickerComponent from "../datepicker/Datepicker";

const Create = ({
    title,
    inputs,
    fileInput = false,
    apiCall,
    onSuccess,
    singleDate = false,
    startEndDate = false,
}) => {
    const [file, setFile] = useState("");
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setInfo((prev) => ({...prev, [e.target.id]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = file ? { ...info, file } : { ...info };
            const response = await apiCall(formData);
            
            if (response.data.status === "success") {
              onSuccess(response.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new">
            <div className="new-container">
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        {
                            fileInput && <div className="left">
                                <img src={(file) ? URL.createObjectURL(file):
                                    (info.profilePicture) ? info.profilePicture : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                                } alt="" />

                                <div className="form-input">
                                    <label htmlFor="file">
                                        Image: <DriveFolderUploadIcon className="icon" />
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>    
                        }
                        <form>
                            {inputs?.map((input) => (
                                <div className="form-input" key={input.id}>
                                <label>{input.label}</label>
                                <input
                                    id={input.id}
                                    onChange={handleChange}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                />
                                </div>
                            ))}
                            {singleDate && <DatePickerComponent

                                />
                            }
                        </form>
                        <div className="submit-button">
                            {loading && <Loader text="Processing..." />}
                            <button type="submit" className="form-btn" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}