import axios from "axios"
import {toast} from "react-toastify"

export const createElementWithPicture = async(file, info, element, url) => {
    const formData = new FormData();

    if(file) {
        formData.append("file", file);
    }

    Object.entries(info).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        
        const res = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });

        if(res.data.status === 'success') {
            toast.success(`${element} ${element === "school" ? 'registered' : 'created'} Successfully!`);
        }

        return res;

    } catch(err) {
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