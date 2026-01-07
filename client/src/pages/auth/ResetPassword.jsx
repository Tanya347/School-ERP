import './resetPassword.scss'

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { somethingWentWrongMsg } from "../../utils/shared/constants"
import axiosInterceptor from '../../utils/shared/axiosInterceptor';

import { logoutUser } from "../../utils/store/slices/authSlice";
import { resetPasswordURL } from '../../utils/endpoints/post';
import Loader from '../../components/shared/loader/Loader';
import { checkSuccess } from '../../utils/shared/commons';

const ResetPassword = ({type}) => {
    
    const [passwordCreds, setPasswordCreds] = useState({
        password: undefined,
        passwordConfirm: undefined
    })
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const token = location.pathname.split("/")[3];

    const handleChange = (e) => {
        setPasswordCreds((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleClick = async(e) => {
        e.preventDefault();
        console.log("j")
        setLoading(true);
        try {
        console.log("h")

            const res = await axiosInterceptor.patch(resetPasswordURL(type, token, user.role), passwordCreds, {withCredentials: true})
            if(checkSuccess(res.data.status)) {
                toast.success("Password changed successfully!");
                if(type === 'change') {
                    dispatch(logoutUser());
                }
                navigate(`/${user.role}Login`);
            }
        } catch(err) {
            const errorMessage = err.response?.data?.message || somethingWentWrongMsg;
            toast.error(errorMessage);
            return err;
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className='reset-password-container'>
            <div className="reset-input-container">
                <h1>Reset Password</h1>
                <label htmlFor="password">{type==='change' && 'Old'} Password</label>
                <div className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter password'
                        id={type === 'change' ? 'passwordConfirm' : 'password'}
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
                <label htmlFor="passwordConfirm">{type !== 'change' && 'Confirm '}New Password</label>
                <div className="password-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter password'
                        id={type === 'change' ? 'password' : 'passwordConfirm'}
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

                {loading && <Loader text="changing password"/>}
                <button onClick={handleClick} className="l-button">
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default ResetPassword