import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './resetPassword.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../../config/context/AuthContext";
import axios from 'axios';
import { resetPasswordURL } from '../../config/endpoints/post';

const ResetPassword = ({type}) => {
    const location = useLocation();
    const token = location.pathname.split("/")[3];
    const [passwordCreds, setPasswordCreds] = useState({
        password: undefined,
        passwordConfirm: undefined
    })
    const {logout} = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setPasswordCreds((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleClick = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(resetPasswordURL(type, token), passwordCreds, {withCredentials: true})
            if(res.data.status === "success") {
                toast.success("Password changed successfully!");
                if(type === 'admin') {
                    await logout("Logged Out Successfully!");
                }
                navigate(`/${type}Login`);
            }
        } catch(err) {
            const errorMessage = err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
            console.error(err);
            return err;
        }
    }
    
    return (
        <div className='reset-password-container'>
            <div className="reset-input-container">
                <h1>Reset Password</h1>
                <label htmlFor="password">Enter {type==='admin' && 'Old'} Password</label>
                <div className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter password'
                        id={type === 'admin' ? 'passwordConfirm' : 'password'}
                        onChange={handleChange}
                        className='reset-input'
                        style={{"width": "100%", "marginTop": "10px"}}
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </span>
                </div>
                <label htmlFor="passwordConfirm">{type !== 'admin' && 'Confirm '}Password</label>
                <div className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter password'
                        id={type === 'admin' ? 'password' : 'passwordConfirm'}
                        onChange={handleChange}
                        className='reset-input'
                        style={{"width": "100%", "marginTop": "10px"}}
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </span>
                </div>

                <button onClick={handleClick} className="lButton">
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default ResetPassword