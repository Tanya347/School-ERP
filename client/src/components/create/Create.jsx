import { useState } from "react";
import { ClipLoader } from "react-spinners";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
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
            <div className="newContainer">
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        {
                            fileInput && <div className="left">
                                <img src={(file) ? URL.createObjectURL(file):
                                    (info.profilePicture) ? info.profilePicture : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                } alt="" />

                                <div className="formInput">
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
                            {singleDate && <DatePickerComponent

                                />
                            }
                        </form>
                        <div className="submitButton">
                            {loading && (
                                <div className="create-loader">
                                    <ClipLoader color="black" size={30} />
                                    Processing...
                                </div>
                            )}
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