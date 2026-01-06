import '../shared/popup/popup.scss'

import CancelIcon from '@mui/icons-material/Cancel';

import { useState } from 'react'
import { toast } from 'react-toastify';
import { successMsg } from "../../config/utils/constants";

import { forgotPaswordURL } from '../../config/endpoints/post';
import { somethingWentWrongMsg } from "../../config/utils/constants"
import axiosInterceptor from '../../config/utils/axiosInterceptor';

const ForgotPassword = ({setOpen, type}) => {
  
  const [email, setEmail] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInterceptor.post(forgotPaswordURL(type), {email})
      if(res.data.status === successMsg) {
        toast.success("Reset password link sent to your email!")
      }
      setOpen(false)
    } catch (err) {
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
        <div className="popup-title">Please enter your email</div>
        <input
          className='popup-input'
          type="email"
          placeholder='Enter email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleClick} className='popup-button'>Generate Reset Link</button>
      </div>
    </div>
  )
}

export default ForgotPassword