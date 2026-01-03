import '../shared/popup/popup.scss'

import CancelIcon from '@mui/icons-material/Cancel';

import { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

import { addClassTeacher } from '../../config/endpoints/put';
import { success, somethingWentWrongMsg } from "../../config/constants"

import Dropdown from '../shared/dropdown/Dropdown';

const AddClassTeacher = ({sclass, teacherList, setOpen}) => {
  
    const [teacher, setTeacher] = useState('');

    const handleClick = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.put(addClassTeacher(sclass), {teacher}, {
                withCredentials: true
            })
            if(res.data.status === success) {
                window.location.reload();
            }
            setOpen(false)
        } catch(err) {
            const errorMessage = err.response?.data?.message || somethingWentWrongMsg;
            toast.error(errorMessage);
            return err;
        }
    }
  return (
    <div className='popup-modal'>
      <div className="popup-container">
        <CancelIcon
          className='popup-close'
          onClick={() => setOpen(false)}
        />
        <Dropdown
            title="Select Teacher"
            options={teacherList}
            onChange={(e) => setTeacher(e.target.value)} />
        <button onClick={handleClick} className='popup-button'>Add Class Teacher</button>
      </div>
    </div>
  )
}

export default AddClassTeacher