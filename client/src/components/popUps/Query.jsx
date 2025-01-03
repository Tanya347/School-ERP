import './query.css'
import { useState } from 'react';
import axios from "axios"
import useFetch from '../../config/service/useFetch';
import { getClassDetails } from '../../config/endpoints/get';
import { postURLs } from '../../config/endpoints/post';
import { toast } from "react-toastify"
import Popup from './Popup';

const Query = ({ setOpen, user }) => {

    const [info, setInfo] = useState({});
    const [queryTo, setQueryTo] = useState();
    const {data} = useFetch(getClassDetails(user.class))

    // set the usestate to the data user passed 
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    // post the usestate to database
    const handleClick = async (e) => {
        e.preventDefault();

        const newQuery = {
            ...info, author: user.name, queryTo: queryTo
        }
        try {
            const res = await axios.post(postURLs("queries", "normal"), newQuery, {
                withCredentials: true
            })
            if(res.data.status === 'success') {
                toast.success("Query submitted successfully!");
            }
            setOpen(false)
            
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to create user. Please try again.";
            toast.error(errorMessage);
            console.error(err);
            return err;
        }
    }


    return (
        <Popup 
            title="Send Query"
            content={
                <form>
                    <input type="text" id="title" className='formInput' onChange={handleChange} placeholder="Enter your query title" />
                    <textarea 
                        id="description" 
                        onChange={handleChange}
                        placeholder="Describe your query"
                        cols="30"
                        rows="10"
                        name='Query'
                    />
                    <div className="formInput" id='options'>
                        <label>Choose Teacher</label>
                        <select id="queryTo" onChange={(e) => setQueryTo(e.target.value)}>
                            <option key={0} value="none">-</option>
                            {
                                data?.subjects?.map((sub, index) => (
                                    <option key={index} value={sub.teacher._id}>{sub.teacher.teachername}</option>
                                ))
                            }
                        </select>
                    </div>
                </form>
            }
            actions={[
                { label: 'Submit', onClick: handleClick },
            ]}
            onClose={() => setOpen(false)}
        />
    )
}

export default Query