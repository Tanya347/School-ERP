import axios from "axios"
import {toast} from "react-toastify"

export const createElementWithPicture = async(file, info, element, url) => {
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
          } catch (err) {
            toast.error("Failed to upload the image. Please try again.");
            console.error(err);
            return; 
        }
    }

    newElement = {
        ...info,
        ...(element === "course" && { syllabusPicture: pictureUrl ?? null }),
        ...(element === "event" && { poster: pictureUrl ?? null }),
        ...(element !== "course" && element !== "event" && { profilePicture: pictureUrl ?? null }),
        cloud_id: cloudId ?? null,
    };

    try {
        const res = await axios.post(url, newElement, {
            withCredentials: true
        })
        if(res.data.status === 'success') {
            toast.success(`${element} created Successfully!`);
        }

        return res;
    }
    catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to create ${element}. Please try again.`;
        toast.error(errorMessage);
        console.error(err);
        return err;
    }
}

export const createElement = async(response, url, element) => {
    try {
        const res = await axios.post(url, response, {withCredentials: true});
        if(res.data.status === 'success') {
            toast.success(`${element} created successfully!`);
        }
        return res;
    } catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to create ${element}. Please try again.`;
        toast.error(errorMessage);
        console.error(err);
        return err;
    }
}