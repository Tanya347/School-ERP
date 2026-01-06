import { toast } from "react-toastify"
import { successMsg } from "../../config/utils/constants";
import axiosInterceptor from "../utils/axiosInterceptor";

export const createElementWithPicture = async(file, info, element, url) => {
    const formData = new FormData();

    if(file) {
        formData.append("file", file);
    }
    
    Object.entries(info).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const res = await axiosInterceptor.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if(res.data.status === successMsg) {
            toast.success(`${element} ${element === "school" ? 'registered' : 'created'} Successfully!`);
        }

        return res;

    } catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to create ${element}. Please try again.`;
        toast.error(errorMessage);
        return err;
    }
}

export const createElement = async(response, url, element) => {
    try {
        const res = await axiosInterceptor.post(url, response);
        if(res.data.status === successMsg) {
            toast.success(`${element} created successfully!`);
        }
        return res;
    } catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to create ${element}. Please try again.`;
        toast.error(errorMessage);
        return err;
    }
}