import { toast } from "react-toastify"
import axiosInterceptor from "../shared/axiosInterceptor";
import { checkSuccess } from "../../utils/shared/commons"

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
        const res = await axiosInterceptor.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if(checkSuccess(res.data.status)) {
            toast.success(`${element} data edited successfully!`);
        }

        return res;
    }
    catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to update ${element}. Please try again.`;
        toast.error(errorMessage);
        return err;
    }
}

export const editElement = async(response, url, element) => {
    try {
        const res = await axiosInterceptor.put(url, response);
        if(checkSuccess(res.data.status)) {
            toast.success(`${element} edited successfully!`);
        }
        return res;
    } catch(err) {
        const errorMessage = err.response?.data?.message || `Failed to update ${element}. Please try again.`;
        toast.error(errorMessage);
        return err;
    }
}