import './query.css'

import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import axios from "axios"
import useFetch from '../../config/hooks/useFetch';

const Query = ({ setOpen, user }) => {

    const [info, setInfo] = useState({});
    const [queryTo, setQueryTo] = useState();
    const {data} = useFetch(`/classes/details/${user.class}`)

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
            await axios.post("http://localhost:5500/api/queries", newQuery, {
                withCredentials: false
            })
            setOpen(false)
            console.log(newQuery)
        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="modal">
            <div className="mContainer">
                
                <CancelIcon
                    className="mClose"
                    onClick={() => setOpen(false)}
                />

                <div className="mTitle">Send Query</div>

                <form>
                    <input
                        className="formInput"
                        type="text"
                        onChange={handleChange}
                        id="title"
                        placeholder='Enter your query title'
                    />
                    <textarea
                        name="Query"
                        id="description"
                        cols="30"
                        rows="10"
                        onChange={handleChange}
                        placeholder='Describe your query'>
                    </textarea>
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

                <button className="mButton" onClick={handleClick}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Query