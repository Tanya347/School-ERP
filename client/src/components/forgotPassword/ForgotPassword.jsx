import '../shared/popup/popup.scss'

import CancelIcon from '@mui/icons-material/Cancel';

import { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

import { forgotPaswordURL } from '../../config/endpoints/post';

const ForgotPassword = ({setOpen, type}) => {
  
  const [email, setEmail] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(forgotPaswordURL(type), {email}, {
        withCredentials: true
      })
      if(res.data.status === 'success') {
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