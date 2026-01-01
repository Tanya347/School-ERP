import { useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import '../shared/popup/popup.scss'
import axios from 'axios';
import { toast } from 'react-toastify';
import { addClassTeacher } from '../../config/endpoints/put';
import Dropdown from '../shared/dropdown/Dropdown';

const AddClassTeacher = ({sclass, teacherList, setOpen}) => {
    const [teacher, setTeacher] = useState('');

    const handleClick = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.put(addClassTeacher(sclass), {teacher}, {
                withCredentials: true
            })
            if(res.data.status === 'success') {
                window.location.reload();
            }
            setOpen(false)
        } catch(err) {
            const errorMessage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
            console.error(err);
            return err;
        }
    }
  return (
    <div className='popupModal'>
      <div className="popupContainer">
        <CancelIcon
          className='popupClose'
          onClick={() => setOpen(false)}
        />
        <Dropdown
            title="Select Teacher"
            options={teacherList}
            onChange={(e) => setTeacher(e.target.value)} />
        <button onClick={handleClick} className='popupButton'>Add Class Teacher</button>
      </div>
    </div>
  )
}

export default AddClassTeacher