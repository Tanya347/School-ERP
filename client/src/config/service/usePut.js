import axios from "axios"
import {toast} from "react-toastify"

export const editElementWithPicture = async(file, info, element, url) => {
    const formData = new FormData();
    
    Object.keys(info).forEach((key) => {
        if (info[key] !== undefined && info[key] !== null) {
            formData.append(key, info[key]);
        }
    });
    
    if(file) {
        formData.append("file", file);
    }

    try {
        const res = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
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