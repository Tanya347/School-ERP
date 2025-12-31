import axios from "axios"
import {toast} from "react-toastify"

export const editElementWithPicture = async(file, info, element, url) => {
    const formData = new FormData();
    if(file) {
        formData.append("file", file);
    }

    console.log(info)

     Object.entries(info).forEach(([key, value]) => {
        formData.append(key, value);
    });

    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
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