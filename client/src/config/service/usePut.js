import axios from "axios"
import {toast} from "react-toastify"

export const editElementWithPicture = async(file, info, element, url) => {
    let pictureUrl;
    let cloudId;
    let newElement;

    if(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        try {
            const uploadRes = await axios.post(
                `${process.env.REACT_APP_CLOUDINARY}`,
                data,
                { withCredentials: false } 
              );
              pictureUrl = uploadRes.data.url;
              cloudId = uploadRes.data.public_id;

              switch(element) {
                case "course": {
                    newElement = {
                        ...info,
                        syllabusPicture: pictureUrl,
                        cloud_id: cloudId
                    }
                }
                break;
                case "event": {
                    newElement = {
                        ...info,
                        poster: pictureUrl,
                        cloud_id: cloudId
                    }
                }
                break;
                default: {
                    newElement = {
                        ...info,
                        profilePicture: pictureUrl,
                        cloud_id: cloudId
                    }
                }
              }
        } catch (err) {
            toast.error("Failed to upload the image. Please try again.");
            console.error(err);
            return; 
        }
    } else {
        newElement = info;
    }


    try {
        const res = await axios.put(url, newElement, {
            withCredentials: true
        })
        if(res.data.status === 'success') {
            toast.success(`${element} data edited successfully!`);
        }

        return res;
    }
    catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to update ${element}. Please try again.`;
        toast.error(errorMessage);
        console.error(err);
        return err;
    }
}

export const editElement = async(response, url, element) => {
    try {
        const res = await axios.put(url, response, {withCredentials: true});
        if(res.data.status === 'success') {
            toast.success(`${element} edited successfully!`);
        }
        return res;
    } catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to update ${element}. Please try again.`;
        toast.error(errorMessage);
        console.error(err);
        return err;
    }
}