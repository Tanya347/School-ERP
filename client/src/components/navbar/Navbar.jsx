import './navbar.scss'

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { clearNotifications } from "../../config/store/slices/notificationSlice";
import { clearAdmin } from '../../config/store/slices/adminSlice';
import { clearFaculty } from '../../config/store/slices/facultySlice';
import { clearStudent } from "../../config/store/slices/studentSlice";
import { clearSchool } from '../../config/store/slices/schoolSlice';
import { logoutUser } from "../../config/store/slices/authSlice"
import { DarkModeContext } from "../../config/context/darkModeContext";
import { profile_url, roles } from '../../config/utils/constants';

import NotificationsDropdown from './notifications/NotificationsDropdown';

const Navbar = () => {

    const [showNotifications, setShowNotifications] = useState(false);

    const dropdownRef = useRef(null);
    
    const { Dispatch } = useContext(DarkModeContext);
    const { user } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const { list = [] } = useSelector(
        state => state.notifications
    );

    // Get current date and date 7 days ago
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    // Filter notifications from the past week
     const notifications = list.filter(n => {
        const notifDate = new Date(n.updatedAt);
        return notifDate >= weekAgo && notifDate <= now;
    });

    const handleLogout = async (e) => {
        dispatch(logoutUser());
        dispatch(clearNotifications());
        dispatch(clearSchool());
        dispatch(clearAdmin());
        dispatch(clearFaculty());
        dispatch(clearStudent());
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
            ) {
            setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);


    const { info } = useSelector(state => state.school);

    // Helper function to convert string to Title Case
    function toTitleCase(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <div className='navbar-container'>
            <div className="navbar-content">
                <div className="left-navbar-container">
                    <div className="logo">
                        <img src={info?.logo} alt="" />
                    </div>
                    <div className="school-name">
                        <h2>{toTitleCase(info?.name)}</h2>
                    </div>
                </div>
                <div className="right-navbar-container">
                    <div className="profile">
                        {user.role === roles.admin ? ( <img src={profile_url} alt="" /> ) : ( <img src={user.profilePicture} alt="" />)}
                    </div>
                    <h3 className="username">{user.username}</h3>
                    <div className="notifications-wrapper" ref={dropdownRef}>
                        <NotificationsIcon className="icon" onClick={()=> setShowNotifications(!showNotifications)}/>
                        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        {showNotifications && <NotificationsDropdown notifs={notifications} user={user}/>}
                    </div>
                    <div className="dark-mode-toggle" onClick={() => Dispatch({ type: "TOGGLE" })}>
                        <DarkModeIcon className="icon" />
                    </div>
                    <div className="" onClick={handleLogout}>
                        <ExitToAppIcon className="icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar